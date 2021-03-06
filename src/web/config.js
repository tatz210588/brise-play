export const networkConfig = {
    "32520": [
        {
            contractProxyAddress: "0x96dbc0D0DD46EAf516a5f04B3A2864633BA78FD4", //proxy deployment
            tokenContract:"0x267Ae4bA9CE5ef3c87629812596b0D89EcBD81dD",
            networkName: "Bitgert Mainnet"
        },

    ],

    "64668": [
        {
            contractProxyAddress: "0x9414C157938bf269414da2c2fd3e776d10Ca050C", //proxy deployment
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