// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SignedMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "hardhat/console.sol";

contract DogeLottery is ERC721, Ownable, VRFConsumerBaseV2 {
    using Counters for Counters.Counter;
    using Strings for uint256;

    uint8 public constant MAX_CHOICES = 5;
    uint8 public constant PRIZE_RATIO = 2;
    uint256 public constant TICKET_PRICE_IN_CENTS = 10;
    uint8 public constant MIN_REQUEST_CONFIRMATIONS_TO_GET_RANDOM_WORDS = 3;
    uint32 public constant CALLBACK_GAS_LIMIT_TO_GET_RANDOM_WORDS = 100000;
    uint32 public constant NUMBER_OF_RANDOM_WORDS = 1;
    int16 public constant BONE_OFFSET_X = -50;
    int16 public constant BONE_OFFSET_Y = -25;

    mapping(uint256 => uint8) private _choices;
    mapping(uint256 => uint8) private _winChoices;
    mapping(uint256 => uint256) private _requestToTicket;
    mapping(address => uint256) private _winnings;
    mapping(uint256 => uint256) private _ticketPrices;

    int16[4][5] private coordinates = [
        [int16(414), 407, 64, 60],
        [int16(708), 266, 64, 60],
        [int16(806), 407, 64, 60],
        [int16(512), 266, 64, 60],
        [int16(610), 471, 129, 96]
    ];

    VRFCoordinatorV2Interface private immutable _vrfCoordinator;
    ERC20 private immutable _dogeToken;
    uint64 private immutable _subscriptionId;
    bytes32 private immutable _gasLaneHash;

    Counters.Counter private _ticketIdCounter;
    uint256 private _newTicketPrice;
    string private _baseURL;

    constructor(
        uint64 subscriptionId,
        address vrfCoordinatorAddress,
        address dogeTokenAddress,
        bytes32 vrfGasLaneHash,
        uint256 newTicketPrice,
        string memory baseURL
    )
        ERC721("DogeLotteryTicket", "DLT")
        VRFConsumerBaseV2(vrfCoordinatorAddress)
    {
        _vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorAddress);
        _dogeToken = ERC20(dogeTokenAddress);
        _subscriptionId = subscriptionId;
        _gasLaneHash = vrfGasLaneHash;
        _newTicketPrice = newTicketPrice;
        _baseURL = baseURL;
    }

    function setBaseUrl(string memory newBaseURL) public onlyOwner {
        _baseURL = newBaseURL;
    }

    function getBaseUrl() public view returns(string memory) {
        return _baseURL;
    }

    function getNewTicketPrice() public view returns (uint256) {
        return _newTicketPrice;
    }

    function setNewTicketPrice(uint256 newTicketPrice) public onlyOwner {
        require(newTicketPrice > 0, "Price of ticket should be non nullable");

        _newTicketPrice = newTicketPrice;
    }

    function getTicketPrice(uint256 ticketId) public view returns (uint256) {
        return _ticketPrices[ticketId];
    }

    function buyTicket() public returns (uint256) {
        uint256 ticketPrice = getNewTicketPrice();

        bool transferred = _dogeToken.transferFrom(msg.sender, address(this), ticketPrice);
        require(transferred, "Token transfer failed");

        _ticketIdCounter.increment();
        uint256 id = _ticketIdCounter.current();
        _ticketPrices[id] = ticketPrice;

        _safeMint(msg.sender, id);

        return id;
    }

    function _sendMoney(
        address receiver,
        uint256 value
    ) private returns (bool) {
        bool success = _dogeToken.transfer(receiver, value);

        return success;
    }

    function openTicket(uint256 ticketId, uint8 choice) public {
        require(_exists(ticketId), "Ticket should exist");
        require(
            0 < choice && choice <= MAX_CHOICES,
            "You should choose from 1 to 5"
        );
        require(_choices[ticketId] == 0, "Ticket has already been opened");

        address ownerOfTicket = _ownerOf(ticketId);

        require(
            msg.sender == ownerOfTicket,
            "You should be an owner of a ticket"
        );

        _choices[ticketId] = choice;
        uint256 requestId = _vrfCoordinator.requestRandomWords(
            _gasLaneHash,
            _subscriptionId,
            MIN_REQUEST_CONFIRMATIONS_TO_GET_RANDOM_WORDS,
            CALLBACK_GAS_LIMIT_TO_GET_RANDOM_WORDS,
            NUMBER_OF_RANDOM_WORDS
        );
        _requestToTicket[requestId] = ticketId;
    }

    function winnings() public view returns (uint256) {
        return _winnings[msg.sender];
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 ticketId = _requestToTicket[requestId];
        require(ticketId != 0, "Request should exist");
        delete _requestToTicket[requestId];

        uint256 choice = _choices[ticketId];
        uint8 winChoice = uint8(randomWords[0] % MAX_CHOICES + 1);
        _winChoices[ticketId] = winChoice;

        uint256 ticketPrice = _ticketPrices[ticketId];

        if (choice == winChoice) {
            address ownerOfTicket = _ownerOf(ticketId);
            uint256 prize = ticketPrice * PRIZE_RATIO;

            _winnings[ownerOfTicket] += prize;
        } else {
            _winnings[owner()] += ticketPrice;
        }
    }

    function withdrawWinnings() public {
        uint256 senderWinnings = _winnings[msg.sender];
        require(senderWinnings > 0, "You don't have any winnings");

        _winnings[msg.sender] = 0;

        bool sent = _sendMoney(msg.sender, senderWinnings);

        require(sent, "Error during sending money");
    }

    receive() external payable {}

    function tokenURI(
        uint256 ticketId
    ) public view override returns (string memory) {
        _requireMinted(ticketId);

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        _getTicketMetadata(ticketId)
                    )
                )
            );
    }

    function _getTicketMetadata(
        uint256 ticketId
    ) private view returns (bytes memory) {
        return abi.encodePacked(
            '{',
                '"name":"Doge Lottery Ticket #"', ticketId.toString(), '"',
                '"description":"', _getTicketDescription(ticketId), '"',
                '"external_url":"', _getTicketExternalUrl(ticketId), '"',
                '"image":"', _getTicketImageDataURL(ticketId), '"'
            '}'
        );
    }

    function _getTicketDescription(uint256 ticketId) private view returns (string memory) {
        uint8 choice = _choices[ticketId];

        if (choice == 0) {
            return string(abi.encodePacked('New Doge Lottery Ticket #', ticketId.toString()));
        }

        if (choice == _winChoices[ticketId]) {
            return string(abi.encodePacked('Scratched off Doge Lottery Ticket #', ticketId.toString()));
        }

        return string(abi.encodePacked('Scratched off winning Doge Lottery Ticket #', ticketId.toString()));
    }


    function _getTicketExternalUrl(uint256 ticketId) private view returns (string memory) {
        return string(abi.encodePacked(
            _baseURL,
            ticketId.toString()
        ));
    }

    function _getTicketImageDataURL(uint256 ticketId) private view returns (bytes memory) {
        return abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(getTicketImage(ticketId)));
    }

    function getTicketImage(uint256 ticketId) public view returns (bytes memory) {
        return abi.encodePacked(
            '<svg fill="none" version="1.1" viewBox="0 0 1227 774" xmlns="http://www.w3.org/2000/svg">',
                _getTicketBackground(ticketId),
                '<g transform="translate(.5 .5)" rx="0" ry="0" stroke="#1e1e1e">',
                    '<rect width="1226" height="773" rx="5" ry="5" fill="url(#b)" />',
                    '<g fill="#7d7d7d">',
                        _getTicketImageSlots(ticketId),
                    '</g>'
                '</g>',
                _getTicketImageBone(ticketId),
                _getTicketImageTitle(ticketId),
            '</svg>'
        );
    }


    function _getTicketImageSlots(uint256 ticketId) private view returns (bytes memory) {
        bytes memory slots;
        uint8 slotIndex = _choices[ticketId];

        for (uint8 i = 0; i < MAX_CHOICES; i++) {
            slots = abi.encodePacked(
                slots,
                _getTicketImageSlot(coordinates[i][0], coordinates[i][1], coordinates[i][2], coordinates[i][3], slotIndex == i + 1)
            );
        }

        return slots;
    }

    function _getTicketImageSlot(int256 x, int256 y, int256 rx, int256 ry, bool scrachedOff) private pure returns (bytes memory) {
        return abi.encodePacked(
            '<ellipse cx="', _int256ToString(x), '" cy="', _int256ToString(y), '" rx="', _int256ToString(rx), '" ry="', _int256ToString(ry), '"', scrachedOff ? ' fill="#fff"' : '', '/>'
        );
    }

    function _getTicketImageTitle(uint256 ticketId) private pure returns (bytes memory) {
        return abi.encodePacked(
            '<text x="40" y="80" fill="#fff" font-family="sans-serif" font-size="40px" xml:space="preserve">Ticket ',
                ticketId.toString(),
            '</text>'
        );
    }

    function _getTicketBackground(uint256 ticketId) private view returns (bytes memory) {
        return abi.encodePacked(
            '<defs>',
                '<linearGradient id="b" gradientTransform="rotate(-45)">',
                    '<stop stop-color="', _getTicketBackgroundStartColor(ticketId), '" />',
                    '<stop stop-color="#111" offset="100%" />',
                '</linearGradient>',
            '</defs>'
        );
    }

    function _getTicketBackgroundStartColor(uint256 ticketId) private view returns (bytes memory) {
        bool newTicket = _winChoices[ticketId] == 0;

        if (newTicket) {
            return abi.encodePacked('#111');
        }

        return abi.encodePacked(
            'hsl(',
                getTicketBackgroundStartColorHue(ticketId).toString(), ',',
                '80%,',
                '20%',
            ')'
        );
    }

    function getTicketBackgroundStartColorHue(uint256 ticketId) public view returns (uint256) {
        uint256 hash = uint256(sha256(abi.encodePacked(
            address(this),
            ticketId,
            _choices[ticketId],
            _winChoices[ticketId]
        )));
        uint256 hue = uint16(hash % 360);

        return hue;
    }

    function _getTicketImageBone(uint256 ticketId) private view returns (string memory) {
        uint8 winChoice = _winChoices[ticketId];
        uint8 choice = _choices[ticketId];

        if (winChoice == 0 || choice != winChoice) {
            return '';
        }

        uint8 slotIndex = winChoice - 1;
        int16 x = coordinates[slotIndex][0] + BONE_OFFSET_X;
        int16 y = coordinates[slotIndex][1] + BONE_OFFSET_Y;

        return string(abi.encodePacked(
            '<g transform="translate(', _int256ToString(x), ',', _int256ToString(y), ')">',
                '<path d="m83 45.5c-5.25 0.0777-10.3-3.62-11.8-8.69h-42.4c-2 6.82-10.3 10.6-16.6 7.7-6.67-2.63-9.71-11.6-6.03-17.8 2.52-2.7-2.4-5.61-1.57-9.09-0.556-7.48 6.62-14.2 14-13 4.71 0.529 8.91 4.03 10.4 8.59h42.4c2-6.82 10.3-10.6 16.6-7.7 6.22 2.48 9.62 10.6 6.31 16.7-1.44 2.25-2.81 3.99-0.268 5.98 3.8 5.5 0.136 13.5-5.49 16.1-1.67 0.82-3.53 1.25-5.4 1.25z" stroke="#1e1e1e" stroke-width="8.89"/>',
            '</g>'
        ));
    }

    function _int256ToString(int256 value) private pure returns (string memory) {
        return string(abi.encodePacked(value < 0 ? "-" : "", SignedMath.abs(value).toString()));
    }

    function getWinChoice(uint256 ticketId) public view returns (uint8) {
        return _winChoices[ticketId];
    }

    function getChoice(uint256 ticketId) public view returns (uint8) {
        return _choices[ticketId];
    }
}
