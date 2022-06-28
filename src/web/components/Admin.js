import React from 'react'
import Image from 'next/image'
import logo from '../assets/EvoFinance_white.svg'
import { ethers } from 'ethers'


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

const Admin = () => {

    async function setTotalWinnerCount(){
        await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
        const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
        const network = await provider.getNetwork()
        const signer = provider.getSigner()
        const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer)  
        const tx = await contractTx.setNoOfWinners(document.getElementById("winnersCount").value)
        toast('Saving data to Blockchain... Please Wait', {icon: '👏'});
        const receipt = await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
            toast.success(`Data Saved Successfully !!!`)
            setAllowed(true)
        });
    }

    async function setWinner(){
        await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
        const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
        const network = await provider.getNetwork()
        const signer = provider.getSigner()
        const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer)  
        const tx = await contractTx.setWinners(document.getElementById("WinAddress").value)
        toast('Saving data to Blockchain... Please Wait', {icon: '👏'});
        const receipt = await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
            toast.success(`Data Saved Successfully !!!`)
            setAllowed(true)
        });
    }

    async function dailyBurn(){
        await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
        const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
        const network = await provider.getNetwork()
        const signer = provider.getSigner()
        const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer)  
        const tx = await contractTx.burnHere()
        toast('Burn process initiated... Please Wait', {icon: '👏'});
        const receipt = await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
            toast.success(`Daily Burn Executed Successfully !!!`)
            setAllowed(true)
        });
    }

    async function startLottery(){
        await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
        const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
        const network = await provider.getNetwork()
        const signer = provider.getSigner()
        const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer)  
        const tx = await contractTx.startLottery()
        toast('Lottery in process...Searching for winners...Please wait...', {icon: '👏'});
        const receipt = await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
            toast.success(`Winners found !!!`)
            setAllowed(true)
        });
    }

    async function withdraw(){
        await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
        const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
        const network = await provider.getNetwork()
        const signer = provider.getSigner()
        const contractTx = new ethers.Contract(getConfigByChain(network.chainId)[0].contractProxyAddress, POGPlay.abi, signer)
        const etherAmount = ethers.utils.parseUnits(document.getElementById("withDrawAmount").value, 'ether')
        const tx = await contractTx.withdraw(etherAmount)
        toast('Withdrawal in process...Please wait...', {icon: '👏'});
        const receipt = await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
            toast.success(`Withdrawn ${document.getElementById("withDrawAmount").value} EVO to your wallet from the contract !!!`)
            setAllowed(true)
        });
    }

  return (
    <div className={style.wrapper}>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <div className={style.container}>
        <div className={style.contentWrapper}>
          <div className="lg:ml-8 py-16 w-[95%] lg:w-full ">
            <div className="grid gap-8"> 

              <div className={style.glowDivBox}>
                <div className={style.glowDiv}></div>
                    <div className="relative px-7 w-[95%] lg:w-full h-full py-4 bg-[#040f13] rounded-lg leading-none  items-center">
                      <span className="flex items-center space-x-5">
                        <Image className={style.img} src={logo} height={50} width={50} />
                        <span className="pr-6 text-gray-100 text-xl lg:text-3xl">Control Panel</span>
                      </span>
                      <input id="winnersCount" className="h-10 mt-8 w-[40%] lg:w-[60rem] p-1 text-[#000000] rounded-lg z-0 focus:shadow focus:outline-none" placeholder="Total Number of Winners for the current lottery are:"/>
                      <button onClick={()=>setTotalWinnerCount()} className="ml-5 w-[6rem] lg:w-[10rem] h-12 rounded-xl text-white bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 hover:">Save</button>                       
                      <input id="WinAddress" className="h-10 mt-8 w-[40%] lg:w-[60rem] p-1 text-[#000000] rounded-lg z-0 focus:shadow focus:outline-none" placeholder="My Chosen Winner is:"/>
                      <button onClick={()=>setWinner()} className="ml-5 w-[6rem] lg:w-[10rem] h-12 rounded-xl text-white bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 hover:">Save</button>  
                      <button onClick={()=>dailyBurn()} className="w-[100%] md:w-[40%] lg:w-[100%] h-12 mt-8 rounded-xl text-white bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500">Execute Daily Burns</button>                                                                                  
                      <button onClick={()=>startLottery()} className="w-[100%] md:w-[40%] lg:w-[100%] h-12 mt-8 rounded-xl text-white bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500">Start Lottery</button>
                      <input id="withDrawAmount" className="h-10 mt-12 w-[40%] lg:w-[60rem] p-1 text-[#000000] rounded-lg z-0 focus:shadow focus:outline-none" placeholder="Withdraw fund from Contract:"/>
                      <button onClick={()=>withdraw()} className="ml-5 w-[6rem] lg:w-[10rem] h-12 rounded-xl text-white bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 hover:">Withdraw</button>                      
                    </div>
              </div>             
            </div>
        </div>
    </div>
          </div>
        </div>
  )
}

export default Admin
