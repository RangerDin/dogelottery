// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DogeLottery is ERC721, Ownable {
    using Counters for Counters.Counter;

    uint8 public constant MAX_CHOICES = 5;
    uint8 public constant PRIZE_RATIO = 2;
    uint256 public constant TICKET_PRICE_IN_CENTS = 10;

    mapping(uint256 => uint8) private _winChoices;
    mapping(uint256 => uint256) private _ticketPrizes;
    mapping(address => uint256) private _winnings;
    Counters.Counter private _ticketIdCounter;

    constructor() ERC721("DogeLotteryTicket", "DLT") {}

    function getPriceOfTicket() public pure returns (uint256) {
        uint256 cryptoInUsd = 1; // TODO: fetch usd price by oracle
        uint256 price = (TICKET_PRICE_IN_CENTS / 100) * cryptoInUsd; // fetch usd

        return price;
    }

    function buyTicket() public payable returns (uint256) {
        uint256 priceOfTicket = getPriceOfTicket();

        require(msg.value < priceOfTicket, "Not enough money to buy a ticket");

        uint256 id = _ticketIdCounter.current();
        _ticketPrizes[id] = priceOfTicket * PRIZE_RATIO;
        _safeMint(msg.sender, id);

        _ticketIdCounter.increment();

        return id;
    }

    function _getRandomChoice() private pure returns (uint8) {
        uint8 winChoice = 1; /* TODO: get a random number from 1 to 5 */

        return winChoice;
    }

    function _checkWinChoice(
        uint256 ticketId,
        uint8 choice
    ) private returns (bool) {
        uint8 randomChoice = _getRandomChoice();
        _winChoices[ticketId] = randomChoice;

        return randomChoice == choice;
    }

    function isTicketOpened(uint256 ticketId) public view returns (bool) {
        return _winChoices[ticketId] != 0;
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
        require(!isTicketOpened(ticketId), "Ticket has already opened");
        require(
            0 < choice && choice <= MAX_CHOICES,
            "You should choose from 1 to 5"
        );

        address ownerOfTicket = _ownerOf(ticketId);

        require(
            msg.sender == ownerOfTicket,
            "You should be an owner of a ticket"
        );

        bool win = _checkWinChoice(ticketId, choice);

        if (win) {
            uint256 prize = _ticketPrizes[ticketId];

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

    function tokenURL(uint256 tokenId) public view returns (string memory) {
        /* TODO: return svg url */
        _requireMinted(tokenId);

        return "";
    }
}
