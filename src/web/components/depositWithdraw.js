import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import POGPlay from '../artifacts//contracts/POGPlay.sol/POGPlay.json'
import { getConfigByChain } from '../config'
import toast,{Toaster} from 'react-hot-toast'
import {useAccount,useNetwork} from 'wagmi'
import BigNumber from 'bignumber.js';

const style = {
    details: `p-3 w-full`,
    info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
    infoLeft: `flex-0.2 flex-wrap`,
    infoRight: `flex-0.4 text-right`,
}

const DepositWithdraw = ({type}) => {

  const {data,isError,isLoading} = useAccount()
  const [depositAmount,setDepositAmount] = useState(0)
  const [contractBalance,setContractBalance]= useState(0)
  const [myWalletEvoBalance, setMyWalletEvoBalance] = useState(0)
  

  useEffect(()=>{
    showEvoBalanceOfUser()
  },[data?.address])
  
  async function showEvoBalanceOfUser(){
      await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
      const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
      const network = await provider.getNetwork()
      const signer = provider.getSigner()  
      const tokenContract = new ethers.Contract(getConfigByChain(network.chainId)[0].tokenContract, POGPlay.abi, signer) 
      data?setMyWalletEvoBalance(formatBigNumber(await tokenContract.balanceOf(data?.address))):setMyWalletEvoBalance(0)
      const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer)
      setDepositAmount(formatBigNumber(await contractTx.netLockedAmount()))
  }

  async function deposit(){
    await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
    const network = await provider.getNetwork()
    const signer = provider.getSigner()
    const etherAmount = ethers.utils.parseUnits(document.getElementById(type).value, 'ether')
    const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer)
    const tx = await contractTx.deposit(etherAmount)
    toast('Transaction pending... Please wait', {icon: '👏'});
    const receipt = await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
      toast.success(`Successfully deposited ${document.getElementById(type).value} Evo token`)
      showEvoBalanceOfUser() //Refresh User balance and deposits
    });
  }

  function formatBigNumber(bn) {
    const divideBy = new BigNumber('10').pow(new BigNumber(18))
    const converted = new BigNumber(bn.toString())
    const divided = converted.div(divideBy)
    return divided.toFixed(0, BigNumber.ROUND_DOWN)
}

  function getMaxDeposit(){
    document.getElementById(type).value = myWalletEvoBalance;
  }

  function getMaxWithdrw(){
    document.getElementById(type).value = depositAmount;
  }
 
  async function withdraw(){
    await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
    const network = await provider.getNetwork()
    const signer = provider.getSigner()
    const etherAmount = ethers.utils.parseUnits(document.getElementById(type).value, 'ether')
    const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer)
    const tx = await contractTx.forceWithdraw(etherAmount)
    toast('Withdrawal pending... Please wait', {icon: '👏'});
    const receipt = await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
      toast.success(`Successfully Withdrawn ${document.getElementById(type).value} Evo token`)
      showEvoBalanceOfUser() //Refresh User balance and deposits
    });
  }


  return (
    <div>
      <div className={style.details}>
        <Toaster position="top-center" reverseOrder={false} />
                        <div className={style.info}>
                            <div className={style.infoLeft}>
                              <div>                              
                                  <div className="flex justify-center items-center">
                                      <div className="relative">
                                          <div className="absolute top-4 left-3"> 
                                            <i className="fa fa-search text-black-400 z-20 hover:text-black-500"></i> 
                                          </div> 
                                          <input id={type} type="text" className="h-10 w-[95%] lg:w-[60rem] p-1 text-[#000000] rounded-lg z-0 focus:shadow focus:outline-none" placeholder={type}/>
                                          
                                      </div>
                                      
                                      {type === 'Deposit' ? (
                                        <>
                                          <button onClick={()=>getMaxDeposit()} className="h-10 w-[2rem] lg:w-20 text-green-500 rounded-lg bg-transparent">MAX</button> 
                                          <button onClick={()=>deposit()} className="ml-5 w-[6rem] lg:w-[10rem] h-12 rounded-xl text-white bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 hover:">
                                              {type}
                                          </button>  
                                        </>
                                      ) : (
                                        <>
                                        <button onClick={()=>getMaxWithdrw()} className="h-10 w-[2rem] lg:w-20 text-green-500 rounded-lg bg-transparent">MAX</button> 
                                        <button onClick={()=>withdraw()} className="ml-5 w-[6rem] lg:w-[10rem] h-12 rounded-xl text-white bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 hover:">
                                            {type}
                                        </button>  
                                        </>
                                      )}
                                      
                                  </div>                                             
                              </div>                                                        
                            </div>  
                        </div>
                    </div>
                    <div >
                      <div className={style.info}>
                        <div className={style.infoLeft}>
                        {type === 'Deposit' ? (
                            <div className='text-[#00ff00] text-xs ml-5'>Your EVO Balance is:&nbsp;&nbsp;{myWalletEvoBalance} EVO</div>
                        ) :(
                          <>
                          <div className='text-[#00ff00] text-xs ml-5'>Locked Amount:&nbsp;&nbsp;{depositAmount} EVO</div>
                          <div className='text-[#ed3b18] text-xs ml-5'>N.B-**Withdrawing locked balance will incur heavy Tax upto 28%.**</div>
                          </>
                        )}
                          
                        </div>
                        
                      </div>
                    </div>
    </div>
  )
}

export default DepositWithdraw
