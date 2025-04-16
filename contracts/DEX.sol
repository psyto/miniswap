// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DEX is ReentrancyGuard {
    // State variables
    IERC20 public token1;
    IERC20 public token2;
    uint256 public reserve1;
    uint256 public reserve2;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    // Events
    event Swap(address indexed sender, uint256 amountIn, uint256 amountOut);
    event AddLiquidity(address indexed sender, uint256 amount1, uint256 amount2);
    event RemoveLiquidity(address indexed sender, uint256 amount1, uint256 amount2);

    constructor(address _token1, address _token2) {
        token1 = IERC20(_token1);
        token2 = IERC20(_token2);
    }

    // Add liquidity to the pool
    function addLiquidity(uint256 amount1, uint256 amount2) external nonReentrant {
        require(amount1 > 0 && amount2 > 0, "Amounts must be greater than 0");
        
        // Transfer tokens from user to contract
        token1.transferFrom(msg.sender, address(this), amount1);
        token2.transferFrom(msg.sender, address(this), amount2);

        // Calculate liquidity tokens to mint
        uint256 liquidity;
        if (totalSupply == 0) {
            liquidity = sqrt(amount1 * amount2);
        } else {
            liquidity = min(
                (amount1 * totalSupply) / reserve1,
                (amount2 * totalSupply) / reserve2
            );
        }

        // Update reserves and mint liquidity tokens
        reserve1 += amount1;
        reserve2 += amount2;
        totalSupply += liquidity;
        balanceOf[msg.sender] += liquidity;

        emit AddLiquidity(msg.sender, amount1, amount2);
    }

    // Remove liquidity from the pool
    function removeLiquidity(uint256 liquidity) external nonReentrant {
        require(liquidity > 0, "Liquidity must be greater than 0");
        require(balanceOf[msg.sender] >= liquidity, "Insufficient liquidity");

        // Calculate amounts to return
        uint256 amount1 = (liquidity * reserve1) / totalSupply;
        uint256 amount2 = (liquidity * reserve2) / totalSupply;

        // Update reserves and burn liquidity tokens
        reserve1 -= amount1;
        reserve2 -= amount2;
        totalSupply -= liquidity;
        balanceOf[msg.sender] -= liquidity;

        // Transfer tokens back to user
        token1.transfer(msg.sender, amount1);
        token2.transfer(msg.sender, amount2);

        emit RemoveLiquidity(msg.sender, amount1, amount2);
    }

    // Swap token1 for token2
    function swapToken1ForToken2(uint256 amountIn) external nonReentrant {
        require(amountIn > 0, "Amount must be greater than 0");
        
        // Calculate amount out using constant product formula
        uint256 amountOut = (amountIn * reserve2) / (reserve1 + amountIn);
        require(amountOut > 0, "Insufficient output amount");

        // Transfer tokens
        token1.transferFrom(msg.sender, address(this), amountIn);
        token2.transfer(msg.sender, amountOut);

        // Update reserves
        reserve1 += amountIn;
        reserve2 -= amountOut;

        emit Swap(msg.sender, amountIn, amountOut);
    }

    // Swap token2 for token1
    function swapToken2ForToken1(uint256 amountIn) external nonReentrant {
        require(amountIn > 0, "Amount must be greater than 0");
        
        // Calculate amount out using constant product formula
        uint256 amountOut = (amountIn * reserve1) / (reserve2 + amountIn);
        require(amountOut > 0, "Insufficient output amount");

        // Transfer tokens
        token2.transferFrom(msg.sender, address(this), amountIn);
        token1.transfer(msg.sender, amountOut);

        // Update reserves
        reserve2 += amountIn;
        reserve1 -= amountOut;

        emit Swap(msg.sender, amountIn, amountOut);
    }

    // Helper functions
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function min(uint256 x, uint256 y) internal pure returns (uint256) {
        return x < y ? x : y;
    }
} 