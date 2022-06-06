//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract NenoVaultV1 is Ownable{

    string public vaultName;

    // list of allowed tokens to be wrapped into neTokens
    mapping (address => bool) public isAllowed;
    address[] public tokens;

    // depositor's balance of neTokens
    mapping (address => uint256) public balanceOf;

    constructor(string memory _name, address _allowedToken){
        vaultName = _name;
        isAllowed[_allowedToken] = true;
        tokens.push(_allowedToken);
    }

    function deposit(address _token, uint256 _amount) public {
        require(isAllowed[_token]==true, "Token is not allowed");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        
    }
}
