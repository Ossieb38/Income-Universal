require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Use Alchemy free tier - no payment needed
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "demo";

module.exports = {
  solidity: "0.8.19",
  networks: {
    amoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
