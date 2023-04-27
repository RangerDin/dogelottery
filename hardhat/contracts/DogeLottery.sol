// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract DogeLottery is ERC721, Ownable, VRFConsumerBaseV2 {
    using Counters for Counters.Counter;
    using Strings for uint256;

    uint8 public constant MAX_CHOICES = 5;
    uint8 public constant PRIZE_RATIO = 2;
    uint256 public constant TICKET_PRICE_IN_CENTS = 10;
    uint8 public constant MIN_REQUEST_CONFIRMATIONS_TO_GET_RANDOM_WORDS = 3;
    uint32 public constant CALLBACK_GAS_LIMIT_TO_GET_RANDOM_WORDS = 100000;
    uint32 public constant NUMBER_OF_RANDOM_WORDS = 1;

    mapping(uint256 => uint8) private _choices;
    mapping(uint256 => uint8) private _winChoices;
    mapping(uint256 => uint256) private _requestToTicket;
    mapping(address => uint256) private _winnings;
    mapping(uint256 => uint256) private _ticketPrices;

    VRFCoordinatorV2Interface private immutable _vrfCoordinator;
    uint64 private immutable _subscriptionId;
    bytes32 private immutable _gasLaneHash;

    Counters.Counter private _ticketIdCounter;
    uint256 private _newTicketPrice;
    string private _baseURL;

    constructor(
        uint64 subscriptionId,
        address vrfCoordinatorAddress,
        bytes32 vrfGasLaneHash,
        uint256 newTicketPrice,
        string memory baseURL
    )
        ERC721("DogeLotteryTicket", "DLT")
        VRFConsumerBaseV2(vrfCoordinatorAddress)
    {
        _vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorAddress);
        _subscriptionId = subscriptionId;
        _gasLaneHash = vrfGasLaneHash;
        _newTicketPrice = newTicketPrice;
        _baseURL = baseURL;
    }

    function setBaseUrl(string memory newBaseURL) public onlyOwner {
        _baseURL = newBaseURL;
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

    function buyTicket() public payable returns (uint256) {
        uint256 ticketPrice = getNewTicketPrice();

        require(msg.value == ticketPrice, "You should set exact price");

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
        (bool success, ) = payable(receiver).call{value: value}("");

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

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 ticketId = _requestToTicket[requestId];
        require(ticketId != 0, "Request should exist");
        delete _requestToTicket[requestId];

        uint256 choice = _choices[ticketId];
        uint8 winChoice = uint8(randomWords[0] % MAX_CHOICES);
        _winChoices[ticketId] = winChoice;

        if (choice == winChoice) {
            address ownerOfTicket = _ownerOf(ticketId);
            uint256 prize = _ticketPrices[ticketId] * PRIZE_RATIO;

            _winnings[ownerOfTicket] += prize;
        }
    }

    function withdrawWinnings() public {
        uint256 senderWinnings = _winnings[msg.sender];
        require(senderWinnings > 0, "You don't have any winnings");

        _winnings[msg.sender] = 0;

        bool sent = _sendMoney(msg.sender, senderWinnings);

        require(sent, "Error during sending money");
    }

    function withdrawLeftovers(uint256 value) public onlyOwner {
        bool sent = _sendMoney(msg.sender, value);

        require(sent, "Error during withdrawing");
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
    ) public view returns (bytes memory) {
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
        /* TODO: return real ticket svg with generated background */
        return abi.encodePacked(
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<svg>',
            '</svg>'
        );
    }
}
