// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying QuizRewards contract...");

    // Get the contract factory
    const QuizRewards = await ethers.getContractFactory("QuizRewards");

    // Deploy the contract
    const quizRewards = await QuizRewards.deploy();
    await quizRewards.deployed();

    console.log("QuizRewards deployed to:", quizRewards.address);

    // Fund the contract with some CELO for rewards
    const fundAmount = ethers.utils.parseEther("1.0"); // 1 CELO
    await quizRewards.fundContract({ value: fundAmount });

    console.log("Contract funded with 1 CELO");
    console.log("Contract balance:", ethers.utils.formatEther(await quizRewards.getContractBalance()), "CELO");

    // Verify deployment
    console.log("\nContract verification info:");
    console.log("Network:", network.name);
    console.log("Deployer:", await (await ethers.getSigners())[0].getAddress());

    return quizRewards.address;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });