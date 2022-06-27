const { ethers, upgrades } = require("hardhat")


async function main() {

  const pogPlay = await ethers.getContractFactory("POGPlay")
  const proxy = await upgrades.deployProxy(pogPlay)
  console.log("POGPlay deployed to:", proxy.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("This is error")
    console.error(error)
    process.exit(1)
  })
