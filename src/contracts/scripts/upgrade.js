const { ethers, upgrades } = require("hardhat")

async function main() {
    const pogPlay = await ethers.getContractFactory("POGPlay")
    let proxy = await upgrades.upgradeProxy("0xD07aa7216962C5f90D989A0c0435Dc8926C18c04", pogPlay) //Rinkeby (proxy address)
    //let proxy = await upgrades.upgradeProxy("0x90179ba681708dC36C38828153130D5B7836b7D5", pogPlay) //Bitgert testnet (proxy address)
    console.log("POGPlay smart contract has been successfully upgraded.")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
