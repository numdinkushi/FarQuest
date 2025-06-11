// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract QuizRewards is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // User statistics
    struct UserStats {
        uint256 totalQuizzes;
        uint256 correctAnswers;
        uint256 streakCount;
        uint256 totalRewards;
        uint256 nftCount;
        bool hasQuizMasterNFT;
        bool hasHighEarnerNFT;
    }

    // Quiz session
    struct QuizSession {
        address user;
        uint256 score;
        uint256 totalQuestions;
        uint256 rewardAmount;
        uint256 timestamp;
        bool completed;
    }

    mapping(address => UserStats) public userStats;
    mapping(address => QuizSession) public activeQuizzes;
    mapping(uint256 => string) public nftMetadata;

    // Events
    event QuizStarted(address indexed user, uint256 timestamp);
    event QuizCompleted(
        address indexed user,
        uint256 score,
        uint256 totalQuestions,
        uint256 reward
    );
    event RewardDistributed(address indexed user, uint256 amount);
    event NFTMinted(address indexed user, uint256 tokenId, string nftType);

    // NFT metadata URIs
    string public constant QUIZ_MASTER_URI =
        "https://gateway.pinata.cloud/ipfs/QmQuizMasterNFT";
    string public constant HIGH_EARNER_URI =
        "https://gateway.pinata.cloud/ipfs/QmHighEarnerNFT";

    // Reward rates (in wei)
    uint256 public constant EASY_QUESTION_REWARD = 10 * 10 ** 15; // 0.01 CELO
    uint256 public constant MEDIUM_QUESTION_REWARD = 15 * 10 ** 15; // 0.015 CELO
    uint256 public constant HARD_QUESTION_REWARD = 20 * 10 ** 15; // 0.02 CELO
    uint256 public constant PERFECT_SCORE_BONUS = 50 * 10 ** 15; // 0.05 CELO

    constructor() ERC721("QuizCelo NFT", "QCNFT") {}

    // Start a new quiz session
    function startQuiz() external {
        require(
            activeQuizzes[msg.sender].completed ||
                activeQuizzes[msg.sender].user == address(0),
            "Active quiz in progress"
        );

        activeQuizzes[msg.sender] = QuizSession({
            user: msg.sender,
            score: 0,
            totalQuestions: 5,
            rewardAmount: 0,
            timestamp: block.timestamp,
            completed: false
        });

        emit QuizStarted(msg.sender, block.timestamp);
    }

    // Submit quiz results and distribute rewards
    function completeQuiz(
        uint256 score,
        uint256 totalQuestions,
        uint256[] calldata questionDifficulties // 0=easy, 1=medium, 2=hard
    ) external nonReentrant {
        require(
            activeQuizzes[msg.sender].user == msg.sender,
            "No active quiz found"
        );
        require(!activeQuizzes[msg.sender].completed, "Quiz already completed");
        require(score <= totalQuestions, "Invalid score");
        require(
            questionDifficulties.length == totalQuestions,
            "Invalid difficulty array"
        );

        // Calculate rewards based on correct answers and difficulty
        uint256 totalReward = 0;
        for (uint256 i = 0; i < score; i++) {
            if (questionDifficulties[i] == 0) {
                totalReward += EASY_QUESTION_REWARD;
            } else if (questionDifficulties[i] == 1) {
                totalReward += MEDIUM_QUESTION_REWARD;
            } else {
                totalReward += HARD_QUESTION_REWARD;
            }
        }

        // Perfect score bonus
        if (score == totalQuestions) {
            totalReward += PERFECT_SCORE_BONUS;
        }

        // Update quiz session
        activeQuizzes[msg.sender].score = score;
        activeQuizzes[msg.sender].rewardAmount = totalReward;
        activeQuizzes[msg.sender].completed = true;

        // Update user stats
        userStats[msg.sender].totalQuizzes++;
        userStats[msg.sender].correctAnswers += score;
        userStats[msg.sender].totalRewards += totalReward;

        // Update streak
        if (score == totalQuestions) {
            userStats[msg.sender].streakCount++;
        } else {
            userStats[msg.sender].streakCount = 0;
        }

        // Distribute CELO rewards
        if (totalReward > 0 && address(this).balance >= totalReward) {
            payable(msg.sender).transfer(totalReward);
            emit RewardDistributed(msg.sender, totalReward);
        }

        // Check for NFT eligibility
        _checkAndMintNFTs(msg.sender);

        emit QuizCompleted(msg.sender, score, totalQuestions, totalReward);
    }

    // Check and mint NFTs based on achievements
    function _checkAndMintNFTs(address user) internal {
        UserStats storage stats = userStats[user];

        // Quiz Master NFT - for perfect score
        if (
            activeQuizzes[user].score == activeQuizzes[user].totalQuestions &&
            !stats.hasQuizMasterNFT
        ) {
            _mintNFT(user, QUIZ_MASTER_URI, "Quiz Master");
            stats.hasQuizMasterNFT = true;
        }

        // High Earner NFT - for earning 50+ rewards
        if (stats.totalRewards >= 50 * 10 ** 15 && !stats.hasHighEarnerNFT) {
            _mintNFT(user, HIGH_EARNER_URI, "High Earner");
            stats.hasHighEarnerNFT = true;
        }
    }

    // Internal function to mint NFT
    function _mintNFT(
        address to,
        string memory uri,
        string memory nftType
    ) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);

        userStats[to].nftCount++;
        nftMetadata[tokenId] = nftType;

        emit NFTMinted(to, tokenId, nftType);
    }

    // Get user statistics
    function getUserStats(
        address user
    ) external view returns (UserStats memory) {
        return userStats[user];
    }

    // Get active quiz session
    function getActiveQuiz(
        address user
    ) external view returns (QuizSession memory) {
        return activeQuizzes[user];
    }

    // Get user's NFTs
    function getUserNFTs(
        address user
    ) external view returns (uint256[] memory, string[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        string[] memory metadata = new string[](balance);

        uint256 index = 0;
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_exists(i) && ownerOf(i) == user) {
                tokenIds[index] = i;
                metadata[index] = nftMetadata[i];
                index++;
            }
        }

        return (tokenIds, metadata);
    }

    // Fund the contract (only owner)
    function fundContract() external payable onlyOwner {}

    // Withdraw funds (only owner)
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Required overrides
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
