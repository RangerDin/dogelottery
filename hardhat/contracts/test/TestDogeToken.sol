// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestDogeToken is ERC20 {
    uint256 private immutable _requestAmount;
    mapping (address => uint256) private _lockTime;

    constructor(uint256 requestAmount) ERC20("TestDogeToken", "TDT") {
        _requestAmount = requestAmount;
    }

    function requestTokens() external {
        require(_lockTime[msg.sender] < block.timestamp, "TestDogeToken: you can't request tokens yet");

        _lockTime[msg.sender] = block.timestamp + 1 days;

        _mint(msg.sender, _requestAmount);
    }

    function getRequestAmount() public view returns (uint256) {
        return _requestAmount;
    }
}
