require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('@openzeppelin/hardhat-upgrades')

const infura_projectId = '403f2033226a44788c2638cc1c29d438'
const fs = require('fs')
const privateKey = fs.readFileSync('.secret').toString()

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },    
    bitgert_main: {
      url: 'https://mainnet-rpc.brisescan.com',
      accounts: [privateKey],
    },
    bitgert_test: {
      url: 'https://testnet-rpc.brisescan.com',
      accounts: [privateKey],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infura_projectId}`,
      accounts: [privateKey],
    },
  },
  etherscan: {
    apiKey: '5PB2QWEDWRA9JBUWGBDHHZFM2X5YECC5Q2',
  },
  solidity: '0.8.4',
  paths: {
    artifacts: '../web/artifacts',
  },
}
