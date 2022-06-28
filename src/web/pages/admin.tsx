import Admin from '../components/Admin'
import React, { useEffect, useState } from 'react'
import {useAccount,useNetwork} from 'wagmi'
import { ethers } from 'ethers'
import { getConfigByChain } from '../config'
import POGPlay from '../artifacts/contracts/POGPlay.sol/POGPlay.json'

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
}

const AdminControl = () => {

  const { data } = useAccount()
  const {activeChain} = useNetwork()
  const [admin, setAdmin] = useState<any>()

  useEffect(()=>{
    getAdmin()
  },[data?.address])

  async function getAdmin() {
    await (window as any).ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
    const signer = provider.getSigner()
    const network = await provider.getNetwork()

    const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer)  
    const tx = await contractTx.getAdmin()
    setAdmin(tx) //comment this line to withdraw admin restrictions
    //setAdmin(tx) //comment this line to restrict admin access
  }

  return(
  <div className={style.wrapper}>
    {data?.address === admin && data ? (
      <Admin />
    ) : (
      <div className='flex justify-center text-3xl bg-[#000000] items-center text-[#ffffff] p-12'>
        <h1>Access Denied.</h1>
      </div>
    )}    
  </div>
  )
}

export default AdminControl

