import React, { useEffect, useState } from 'react'
import DepositWithdraw from './depositWithdraw'
import {useAccount,useNetwork} from 'wagmi'
import { ethers } from 'ethers'
import POGPlay from '../artifacts/contracts/POGPlay.sol/POGPlay.json'
import { getConfigByChain } from '../config'
import BigNumber from 'bignumber.js';
import Image from 'next/image'
import logo from '../assets/EvoFinance_white.svg'
import toast,{Toaster} from 'react-hot-toast'



const style = {
  wrapper: `relative`,
  searchBar: `flex flex-1 mx-[0.8rem] w-[100%] items-center bg-transparent rounded-[0.8rem] hover:bg-transparent mt-2 p-1 pay-search`,
  container: `flex flex-wrap before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[#040f13] before:bg-cover before:bg-center before:bg-fixed before:opacity-100`,
  contentWrapper: `w-[95%] lg:w-full m-4 relative justify-center flex flex-wrap items-center block flex-grow lg:flex lg:items-center lg:w-auto`,
  copyContainer: `w-[95%] lg:w-full lg:flex md:flex items-center`,
  boxWrapper: `w-full relative border m-4 shadow-20xl before:blur bg-[#ffffff] shadow-inner border-[#414663] rounded bg-[#ffffff]] overflow-hidden justify-center `,
  infoLeft: `flex-0.2 flex-wrap`,
  txt:`text-[#ffffff] bg-[#000000] text-opacity-100 text-9xl font-black before:content-[] before:absolute before:mix-blend-difference before:blur-[5px]`,
  neonWrapper:`inline-flex brightness-200`,
  gradient:`absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-purple-600 blur opacity-100 mix-blend-multiply top-3 left-2.5 right-2.5 bottom-2.5 `,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  assetName: `font-sans text-md lg:text-xl mt-2 text-[#ffffff]`,
  winDetails: `font-sans text-sm lg:text-xl mt-2 text-[#ffffff]`,
  timeStyle: `font-sans text-4xl mt-2 text-[#ffffff]`,
  timeData: `font-sans text-xs text-[#ffffff]`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  infoRight: `flex-0.4 text-right`,
  infoCenter: `flex-0.4 text-center`,
  currentAPY: `font-sans text-md lg:text-xl mt-2 text-[#00ff00]`,
  glowDivBox:`relative group w-full lg:w-[95%]  `,
  glowDiv:` flex w-[95%] lg:w-full  absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt`,
  glowDivSmall:` flex w-[95%] lg:w-[40rem]  absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt`,
  searchInput: `form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`,
  logoText: ` ml-[0.8rem] font-semibold text-2xl tracking-tight text-[#ffffff]`,
  img: `fill-current h-8 w-8 mr-2`,
}
  



const Hero = () => {

  const [prizeMoney, setPrizeMoney] = useState<any>(0)
  const [claimableAmount,setClaimableAmount] = React.useState<any>(0)
  const {data,isError,isLoading} = useAccount()
  const [contractBalance,setContractBalance]= useState<any>(0)
  const [allowed, setAllowed] = useState<any>(false)
  const [locked, setLocked] = useState<any>(0)
  const [myDeposit, setMyDeposit] = useState<any>(0)
  const [myReward, setMyReward] = useState<any>(0)
  const [myChanceofWinning, setMyChanceofWinning] = useState<any>(0)
  
 
  useEffect(() => {
    getContractBalance()
    checkAllowance()
    showScreenDetailsOnLoad()
}, [data?.address])


async function checkAllowance(){
  await (window as any).ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
  const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
  const network = await provider.getNetwork()
  const signer = provider.getSigner()  
  const tokenContract = new ethers.Contract(getConfigByChain(network.chainId)[0].tokenContract, POGPlay.abi, signer)  
  //use await function for handling promise
  if(data){
    const tx = await tokenContract.allowance(data?.address,getConfigByChain(network.chainId)[0].contractProxyAddress)
    formatBigNumber(tx) != '0' ? setAllowed(true) : setAllowed(false)  
  }
}
async function getContractBalance(){

  await (window as any).ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
  const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
  const network = await provider.getNetwork()
  const signer = provider.getSigner()
  const tokenContract = new ethers.Contract(getConfigByChain(network.chainId)[0].tokenContract, POGPlay.abi, signer)
  const bal = await tokenContract.balanceOf(getConfigByChain(network.chainId)[0].contractProxyAddress)
  console.log("bal",bal)
  setContractBalance(formatBigNumber(bal))  

}

async function showScreenDetailsOnLoad(){
  await (window as any).ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
  const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
  const network = await provider.getNetwork()
  const signer = provider.getSigner()
  const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer)  
  const prize = await contractTx.getPrizeMoney()
  setPrizeMoney(ethers.utils.formatUnits(prize.toString(),'ether').slice(0, 5))
  const lock = await contractTx.netLockedAmount()
  setLocked(ethers.utils.formatUnits(lock.toString(),'ether').slice(0, 5))
  const depsit = await contractTx.getMyTotalDeposits()
  setMyDeposit(ethers.utils.formatUnits(depsit.toString(),'ether').slice(0, 5))
  const tx = await contractTx.getMyAccumulatedInterest()
  setMyReward(ethers.utils.formatUnits(tx.toString(),'ether').slice(0,7))
  const chance = await contractTx.chanceOfUserToBeWinner()
  setMyChanceofWinning(ethers.utils.formatUnits(chance.toString()).slice(0,7))
  const claimTx = await contractTx.netClaimableAmount()
  setClaimableAmount(ethers.utils.formatUnits(claimTx.toString(),'ether').slice(0,7))

}
async function approve(){
    await (window as any).ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
    const network = await provider.getNetwork()
    const signer = provider.getSigner()
    const tokenContract = new ethers.Contract(getConfigByChain(network.chainId)[0].tokenContract, POGPlay.abi, signer)
    const tx = await tokenContract.approve(getConfigByChain(network.chainId)[0].contractProxyAddress,'115792089237316195423570985008687907853269984665640564039457584007913129639935')      
    toast('Approval in process... Please Wait', {icon: '👏'});
    //tx.hash is available only when writing transaction not reading
    const receipt = await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
      toast.success(`You are successfully Approved `)
      setAllowed(true)
    });    
}
function formatBigNumber(bn) {
    const divideBy = new BigNumber('10').pow(new BigNumber(18))
    const converted = new BigNumber(bn.toString())
    const divided = converted.div(divideBy)
    return divided.toFixed(0, BigNumber.ROUND_DOWN)
}
async function redeemClaimable(){
  await (window as any).ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
  const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
  const network = await provider.getNetwork()
  const signer = provider.getSigner()
  const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer) 
  const tx = await contractTx.redeemClaimable()
  toast('Withdrawal in process... Please Wait', {icon: '👏'});
  const receipt = await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
    toast.success(`Redeemed Successfully !!!`)
    setAllowed(true)
  }); 
}
  
  return (

    <div className={style.wrapper}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={style.container}>
        <div className={style.contentWrapper}>
          <div className="lg:ml-8 py-16 w-[95%] lg:w-full ">
            <div className="grid gap-8">
              <div className={style.glowDivBox}>
                <div className={style.glowDiv}></div>
                <div className="relative px-7 py-9 w-[95%] lg:w-full  h-[17rem] justify-center bg-[#040f13] rounded-lg leading-none  items-center divide-x divide-gray-600">
                  <div className={style.details}>
                    <div className="flex flex-wrap justify-center text-[#e4e8eb] drop-shadow-xl">
                        <div className='items-center font-black text-transparent flex text-5xl md:text-6xl lg:text-9xl bg-clip-text bg-gradient-to-r from-[#dbeb34] via-pink-500 to-purple-600'>Evo: {prizeMoney}</div>
                    </div>
                
                    {/* <div className={`${style.infoCenter} mt-10`}>
                        <div className={style.assetName}>Next Award</div>
                    </div>
                    
                    <div className={`flex-0.4 text-center flex justify-center mt-10`}>
                        <div className={`${style.timeStyle} mr-4`}>06</div>
                        <div className={`${style.timeStyle} mr-4`}>09</div>
                        <div className={`${style.timeStyle} mr-4`}>23</div>
                        <div className={`${style.timeStyle} mr-4`}>42</div>
                    </div>
                    <div className={`flex-0.4 text-center flex justify-center`}>
                        <div className={`${style.timeData} justify-center ml-[-1rem]`}>Days</div>
                        <div className={`${style.timeData} justify-center ml-9`}>Hrs</div>
                        <div className={`${style.timeData} justify-center ml-9`}>Min</div>
                        <div className={`${style.timeData} justify-center ml-9`}>Sec</div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className={style.glowDivBox}>
                <div className={style.glowDiv}></div>
                <div className="relative px-7 py-9 w-[95%] lg:w-full h-[25rem] justify-center bg-[#040f13] rounded-lg leading-none  items-center divide-x divide-gray-600">
                  <div className={style.details}>
                    <div className={style.info}>
                        <div className={style.infoLeft}>
                            <div className={style.assetName}>Current APY:</div>
                            <div className={style.assetName}>Daily ROI: </div>
                            <div className={style.assetName}>My Deposit: </div>
                            <div className={style.assetName}>Earnings: </div>
                            <div className={style.assetName}>My Chance: </div>
                            <div className={style.assetName}>Claimable: </div>
                            <div className={style.assetName}>Locked: </div>                         
                        </div>

                        <div className={style.infoRight}>
                            <div className={style.currentAPY}>62.343%</div>
                            <div className={style.assetName}>0.13283933%</div>
                            <div className={style.assetName}>{data?myDeposit:0}&nbsp;Evo</div>
                            <div className={style.assetName}>{data?myReward:0}&nbsp;Evo</div>
                            <div className={style.assetName}>{data?myChanceofWinning:0}% </div>
                            <div className={style.assetName}>{data?claimableAmount:0} Evo</div>  
                            <div className={style.assetName}>{data?locked:0} Evo</div>                          
                        </div>
                    </div>
                
                    <div className={style.infoCenter}>
                        <button onClick={()=>redeemClaimable()} className="w-[70%] md:[40%] lg:w-[20%] h-12 mt-8 rounded-xl text-white bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500">Redeem Claimable</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.glowDivBox}>
                <div className={style.glowDiv}></div>
                    <div className="relative px-7 w-[95%] lg:w-full h-[10rem] py-4 bg-[#040f13] rounded-lg leading-none  items-center">
                      <span className="flex items-center space-x-5">
                        <Image className={style.img} src={logo} height={50} width={50} />
                        <span className="pr-6 text-gray-100 text-xl lg:text-3xl">Deposit to Win</span>
                      </span>
                      {allowed === true ? (
                        <DepositWithdraw type="Deposit" />
                      ) : (
                        <button onClick={()=>approve()} className="w-[70%] md:w-[40%] lg:w-[100%] h-12 mt-8 rounded-xl text-white bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500">Approve</button>
                      )}
                      
                                            
                    </div>
              </div>
              <div className={style.glowDivBox}>
                <div className={style.glowDiv}></div>
                    <div className="relative px-7 w-[95%] lg:w-full h-[12rem] py-4 bg-[#040f13] rounded-lg leading-none  items-center">
                      <div className={style.info}>
                            <div className={style.infoLeft}>
                              <span className="pr-6 text-gray-100 text-3xl">Withdraw Locked Amount</span>
                            </div>
                            <div className={style.infoRight}>
                              <Image className={style.img} src={logo} height={50} width={60} />
                            </div>
                        </div>
                        <div className='w-[100%]'>
                          <DepositWithdraw type="Withdraw"  />
                        
                        </div>
                        hjkgkdsgsjhg
                    </div>
              </div>
              
                
                <div className='w-full items-center lg:w-full'>
                      <div className={style.glowDivBox}>
                      <div className={style.glowDiv}></div>
                      <div className="relative px-7 py-9 w-[95%] lg:w-full h-[17rem] justify-center bg-[#040f13] rounded-lg leading-none items-center divide-x divide-gray-600">
                        <div className={style.details}>
                          <div className={`font-sans text-2xl text-[#ffffff] mb-4`}>Prize Pool Info</div>
                          <div className={style.info}>
                              <div className={style.infoLeft}>
                                  
                                  <div className={style.winDetails}>Number of Winners:</div>
                                  <div className={style.winDetails}>Total Deposits: </div>
                                  <div className={style.winDetails}>Early Exit Fee: </div>
                                  <div className={style.winDetails}>Exit fee decay time: </div>                         
                              </div>

                              <div className={style.infoRight}>
                                  
                                  <div className={`font-sans text-sm lg:text-xl mt-2 text-[#00ff00]`}>Coming soon</div>
                                  <div className='text-transparent text-xs lg:text-xl mt-3 bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600'> {contractBalance}&nbsp;&nbsp;EVO </div>
                                  <div className={style.winDetails}> 28% </div>
                                  <div className={style.winDetails}> 14 days</div>                           
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                </div>               
              </div>
              </div>
            </div>
          </div>
        </div>
      

  )
}

export default Hero
function wait(tx: any) {
  throw new Error('Function not implemented.')
}

