// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";

contract DogeTokenMock is ERC20PresetFixedSupply{
    constructor() ERC20PresetFixedSupply("DogeTokenMock", "DGT", 100000, msg.sender) {}
}
