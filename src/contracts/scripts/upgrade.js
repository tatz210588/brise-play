const { ethers, upgrades } = require("hardhat")

async function main() {
    const pogPlay = await ethers.getContractFactory("POGPlay")
    let proxy = await upgrades.upgradeProxy("0x5DD3f6973c3F75399E93CC8a788F770795316BB8", pogPlay) //Rinkeby (proxy address)
    //let proxy = await upgrades.upgradeProxy("0x96dbc0D0DD46EAf516a5f04B3A2864633BA78FD4", pogPlay) //Bitgert testnet (proxy address)
    console.log("POGPlay smart contract has been successfully upgraded.")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
