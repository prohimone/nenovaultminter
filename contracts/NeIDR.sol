// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NeIDR is ERC20{
    using SafeERC20 for IERC20;

    // set of minters, can be this bridge or other bridges
    mapping(address => bool) public isMinter;
    address[] public minters;

    modifier onlyAuth{
        require(isMinter[msg.sender], "NeIDR: FORBIDDEN");
        _;
    }

    constructor() ERC20("NeRupiah", "NeIDR"){
        minters.push(msg.sender);
        isMinter[msg.sender] = true;
    }

    function mint(address _to, uint _amount) external onlyAuth{
        _mint(_to, _amount);
    }

    function burn(address vault, uint amount) external onlyAuth{
        _burn(vault, amount);
    }

    function revokeMinter(address _auth) external onlyAuth {
        isMinter[_auth] = false;
    }


    event LogSwapin(bytes32 indexed txhash, address indexed account, uint amount);
    event LogSwapout(address indexed account, address indexed bindaddr, uint amount);

    function Swapin(bytes32 txhash, address account, uint256 amount) public onlyAuth returns (bool) {
        _mint(account, amount);
        emit LogSwapin(txhash, account, amount);
        return true;
    }

    function Swapout(uint256 amount, address bindaddr) public onlyAuth returns (bool) {
        require(bindaddr != address(0), "AnyswapV3ERC20: address(0x0)");
        _burn(msg.sender, amount);
        emit LogSwapout(msg.sender, bindaddr, amount);
        return true;
    }

}