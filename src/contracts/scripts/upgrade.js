const { ethers, upgrades } = require("hardhat")

async function main() {
    const pogPlay = await ethers.getContractFactory("POGPlay")
    let proxy = await upgrades.upgradeProxy("0xD07aa7216962C5f90D989A0c0435Dc8926C18c04", pogPlay) //Rinkeby (proxy address)
    //let proxy = await upgrades.upgradeProxy("0x9414C157938bf269414da2c2fd3e776d10Ca050C", pogPlay) //Bitgert testnet (proxy address)
    console.log("POGPlay smart contract has been successfully upgraded.")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
