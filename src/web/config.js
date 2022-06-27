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
            contractProxyAddress: "0x96dbc0D0DD46EAf516a5f04B3A2864633BA78FD4", //proxy deployment
            tokenContract: "0x267Ae4bA9CE5ef3c87629812596b0D89EcBD81dD",
            networkName: "Bitgert Testnet"
        },
    ],
    "4": [
        {
            contractProxyAddress: "0x5DD3f6973c3F75399E93CC8a788F770795316BB8", //proxy deployment
            tokenContract: "0x02F21d483BeCfe74E8E1C67590d265E493498d1E",
            networkName: "Bitgert Testnet"
        },
    ],
}

export const getConfigByChain = (chain) => networkConfig[chain]