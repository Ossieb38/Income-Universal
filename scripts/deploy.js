async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("🚀 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  const AutoTaskExecutor = await ethers.getContractFactory("AutoTaskExecutor");
  const executor = await AutoTaskExecutor.deploy();
  
  await executor.deployed();
  
  console.log("\n✅ SUCCESS! Contract deployed to:", executor.address);
  console.log("\n📝 Next steps:");
  console.log("1. Save this address in js/web3.js");
  console.log("2. Verify contract on PolygonScan (optional)");
  console.log("3. Start frontend: npm run dev");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
