
const hre = require("hardhat");

async function main() {
const Transaction = await hre.ethers.getContractFactory("Transactions");
  const transaction = await Transaction.deploy();
  await transaction.deployed();

  console.log("Lock with 1 ETH dep:", transaction.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
