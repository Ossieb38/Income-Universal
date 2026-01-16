// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AutoTaskExecutor
 * @dev Free version for testnet deployment
 */
contract AutoTaskExecutor is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    struct Task {
        address worker;
        uint256 platformId;
        bytes32 taskId;
        bytes32 proofHash;
        bool submitted;
        bool claimed;
        uint256 rewardAmount;
        address rewardToken;
    }
    
    mapping(bytes32 => Task) public tasks;
    mapping(address => bool) public authorizedWorkers;
    mapping(address => bool) public supportedTokens;
    
    event TaskSubmitted(bytes32 indexed taskHash, address indexed worker, uint256 platformId);
    event RewardClaimed(bytes32 indexed taskHash, uint256 rewardAmount, address token);
    
    modifier onlyAuthorized() {
        require(authorizedWorkers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    constructor() {
        // Add testnet USDC (free version)
        supportedTokens[0x0000000000000000000000000000000000000000] = true; // Native MATIC
    }
    
    function submitTask(
        uint256 _platformId,
        bytes32 _taskId,
        bytes32 _proofHash,
        address _rewardToken,
        uint256 _expectedReward
    ) external onlyAuthorized nonReentrant returns (bytes32) {
        require(supportedTokens[_rewardToken], "Token not supported");
        
        bytes32 taskHash = keccak256(
            abi.encodePacked(msg.sender, _platformId, _taskId, block.timestamp)
        );
        
        tasks[taskHash] = Task({
            worker: msg.sender,
            platformId: _platformId,
            taskId: _taskId,
            proofHash: _proofHash,
            submitted: true,
            claimed: false,
            rewardAmount: _expectedReward,
            rewardToken: _rewardToken
        });
        
        emit TaskSubmitted(taskHash, msg.sender, _platformId);
        return taskHash;
    }
    
    function claimReward(bytes32 _taskHash, uint256 _actualReward) external onlyOwner nonReentrant {
        Task storage task = tasks[_taskHash];
        require(task.submitted && !task.claimed, "Invalid task state");
        
        task.claimed = true;
        task.rewardAmount = _actualReward;
        
        IERC20(task.rewardToken).safeTransfer(task.worker, _actualReward);
        emit RewardClaimed(_taskHash, _actualReward, task.rewardToken);
    }
    
    function authorizeWorker(address _worker) external onlyOwner {
        authorizedWorkers[_worker] = true;
    }
    
    function addSupportedToken(address _token) external onlyOwner {
        supportedTokens[_token] = true;
    }
}
