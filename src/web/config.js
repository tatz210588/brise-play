export const networkConfig = {
    "32520": [
        {
            contractProxyAddress: "To be deployed", //proxy deployment
            tokenContract:"contract address of EVO token deployed on mainnet should be given here",
            networkName: "Bitgert Mainnet"
        },

    ],

    "64668": [
        {
            contractProxyAddress: "0x90179ba681708dC36C38828153130D5B7836b7D5", //proxy deployment
            tokenContract: "0x796963FD33a4D40091449Dde1781b2F65298A9dF",
            networkName: "Bitgert Testnet"
        },
    ],
    "4": [
        {
            contractProxyAddress: "0xD07aa7216962C5f90D989A0c0435Dc8926C18c04", //proxy deployment
            tokenContract: "0x02F21d483BeCfe74E8E1C67590d265E493498d1E",
            networkName: "Rinkeby Testnet"
        },
    ],
}

export const getConfigByChain = (chain) => networkConfig[chain]