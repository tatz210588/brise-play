import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import {WagmiConfig,configureChains,chain,createClient} from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import {getDefaultWallets,RainbowKitProvider,connectorsForWallets,wallet,Chain, darkTheme} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const Bitgert: Chain = {
  id: 32520,
  name: 'Bitgert',
  network: 'Bitgert',
  iconUrl: 'https://ipfs.infura.io/ipfs/QmaNCiivkiyGDXpna1yPqWdXJjuM7aGeShcWCgk3mfjm3L',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'BRISS',
    symbol: 'BRISS',
  },
  rpcUrls: {
    default: 'https://mainnet-rpc.brisescan.com',
  },
  blockExplorers: {
    default: { name: 'BitgertScan', url: 'https://brisescan.com/' }
  },
  testnet: false,
};
const BitgertTestNet: Chain = {
  id: 64668,
  name: 'Bitgert TestNet',
  network: 'Bitgert TestNet',
  iconUrl: 'https://ipfs.infura.io/ipfs/QmaNCiivkiyGDXpna1yPqWdXJjuM7aGeShcWCgk3mfjm3L',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'BRISS',
    symbol: 'BRISS',
  },
  rpcUrls: {
    default: 'https://testnet-rpc.brisescan.com',
  },
  blockExplorers: {
    default: { name: 'Bitgert-Testnet-Scan', url: 'https://testnet-explorer.brisescan.com/' }
  },
  testnet: true,
};

const {chains, provider} = configureChains(
  [chain.rinkeby,Bitgert, BitgertTestNet],
  [jsonRpcProvider({rpc:chain=>({http:chain.rpcUrls.default})})]
)

// const {connectors} = getDefaultWallets({
//   appName: "My App",
//   chains
// })

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.rainbow({ chains }),
      wallet.walletConnect({ chains }),
      wallet.metaMask({chains}),
      wallet.trust({chains}),
      wallet.argent({chains}),
      wallet.coinbase({appName:"My App",chains}),
      wallet.brave({chains}),
      wallet.steak({chains})
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect:true,
  connectors,
  provider
})



const linkPhoneWithWallet = ({ Component, pageProps }: AppProps) => { 

  return (
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} theme={darkTheme()} coolMode showRecentTransactions={true}>
            <Header />
            <Toaster position="top-center" reverseOrder={false} />
            <Component {...pageProps} />
            <Footer />
          </RainbowKitProvider>
        </WagmiConfig>
  )
}

export default linkPhoneWithWallet
