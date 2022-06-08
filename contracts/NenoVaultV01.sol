//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interface/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";


interface IneIDR{
    function mint(address, uint256) external;
    function burn(address, uint256) external;
}

contract NenoVaultV01 is Ownable{

    string public vaultName;

    address public neIDR;

    // list of allowed tokens to be wrapped into neTokens
     mapping (address => uint16) public tokenDecimals;
    mapping (address => bool) public isAllowed;
    address[] public allowedTokens;


    // tracks depositor's balance of original token
    // mapping (address => mapping (address => uint256)) public balanceOf;
    
    // tracks depositor's balance of tokens deposited (agnostic)
    mapping (address => uint256) public balanceOf;


    event LogDeposit(address indexed token, uint amount);
    event LogWithdraw(address indexed token, uint amount);

    constructor(string memory _name, address _neIDR, address _allowedToken){
        vaultName = _name;
        neIDR = _neIDR;
        isAllowed[_allowedToken] = true;
        allowedTokens.push(_allowedToken);
    }

    function addAllowableToken(address _token) public onlyOwner returns (bool) {
        require(isAllowed[_token] != true, "NENOVAULT: Token is already allowed");
        isAllowed[_token] = true;
        allowedTokens.push(_token);
        return true;
    }

    function deposit(address _token, uint256 _amount) public returns (bool) { //add prereq
        require(isAllowed[_token]==true, "NENOVAULT: Token is not allowed");

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] += _amount;
        IneIDR(neIDR).mint(msg.sender, _amount);

        emit LogDeposit(_token,_amount);
        return true;
    }

    function withdraw(address _token, uint256 _amount) public returns (bool){ //add nonreentrant and prereq
        require(isAllowed[_token]==true, "NENOVAULT: Token is unavailable to withdraw");
        require(balanceOf[msg.sender] >= _amount, "NENOVAULT: user does not have any funds in the vault");
        require(IERC20(_token).balanceOf(address(this)) >= _amount, "NENOVAULT: Vault does not have anymore of this token to withdraw");

        IERC20(neIDR).transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] -= _amount;
        IneIDR(neIDR).burn(address(this), _amount);
        IERC20(_token).transfer(msg.sender, _amount);

        emit LogWithdraw(_token, _amount);
        return true;
    }

    function vaultBalance() public view returns (uint256){
        uint256 total = 0;
        for(uint i = 0; i < allowedTokens.length; i++){
            total += IERC20(allowedTokens[i]).balanceOf(address(this));
        }
        return total;
    }

    function tokenBalance(address _token) public view returns (uint256){
        require(isAllowed[_token]==true, "NENOVAULT: Token is not allowed");
        return IERC20(_token).balanceOf(address(this));
    }

    function isSolvent() public view returns (bool){
        return IERC20(neIDR).totalSupply() == vaultBalance();
    }

}
