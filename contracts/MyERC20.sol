// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.21 <0.7.0;

// Uncomment the line to use openzeppelin/ERC20
// You can use this dependency directly because it has been installed already
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    mapping(address => bool) claimedAirdropPlayerList;

    constructor(string memory name, string memory symbol) public ERC20() {}

    function airdrop(uint32 amount) external {
        _mint(msg.sender, amount);
    }

    function allow(address spender, uint256 addition) external {
        _approve(spender, msg.sender, addition);
    }
}
