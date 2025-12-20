// smart_contract/scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const payment = await hre.ethers.deployContract("ethPayment");
  await payment.waitForDeployment();

  console.log(`Contract deployed to: ${payment.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});