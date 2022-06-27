import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Image from 'next/image'
import logo from '../assets/EvoFinance_white.svg'
// import PhoneInput from 'react-phone-number-input'
import Link from 'next/link'
import {ConnectButton} from '@rainbow-me/rainbowkit'
import { FcSettings } from 'react-icons/fc'
import { CgProfile } from 'react-icons/cg'
import { AiOutlineQrcode } from 'react-icons/ai'
import { BsCashCoin } from 'react-icons/bs'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { FaRegAddressCard } from 'react-icons/fa'
import { chain } from 'wagmi'
// import CircleLoader from 'react-spinners/CircleLoader'
// import Modal from 'react-modal'
// import qrlogo from '../assets/QR.png'

const solutions = [
  {
    name: 'MY Profile',
    description: 'Get your QR code, connected details and linked wallets.',
    href: '/myprofile',
    icon: FcSettings,
  },
  {
    name: 'Send Crypto',
    description: 'Send your crypto to your friend on his phone/email ID directly.',
    href: '/pay',
    icon: BsCashCoin,
  },
  {
    name: 'Scan',
    description: 'Scan and send crypto to your friend directly on his/her QR code.',
    href: '/qrPay',
    icon: AiOutlineQrcode,
  },
  {
    name: 'KYC',
    description: 'Upload your KYC documents to increase transfer limit',
    href: '#',
    icon: FaRegAddressCard,
  },
]

const style = {
  wrapper: `flex flex-wrap items-end content-around bg-[#040f13] px-[1.2rem] p-1 `,
  logoContainer: `flex items-center lg:py-4 flex-shrink-0 text-[#ffffff] mr-6 cursor-pointer`,
  logoText: ` ml-[0.8rem] font-semibold text-2xl tracking-tight text-[#ffffff]`,
  headerItemsTab: `w-full  block flex-grow lg:flex lg:items-center lg:w-auto`,
  headerItems: `text-md lg:flex items-center font-bold lg:flex-grow mt-2`,
  headerItem: `block mt-4 lg:inline-block lg:text-right lg:mt-0 lg:mb-2 py-2 text-[#ffffff] hover:text-[#81817C] mr-6 cursor-pointer`,
  headerIcon: `block lg:inline-block lg:mt-0 text-[#ffffff]  text-3xl hover:text-[#81817C] mr-4 cursor-pointer focus:outline-none`,
  img: `fill-current h-8 w-8 mr-2`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  infoRight: `flex-0.4 text-right`,
}

const Header = () => {
  const [admin, setAdmin] = useState<typeof address>()
  const [done, setDone] = useState(false)
  const [openMenu, setOpenMenu] = React.useState(true)

  const address = 'sdsdsd'//window.ethereum.request({ method: 'eth_requestAccounts' })[0]

  const handleBtnClick = () => {
    setOpenMenu(!openMenu)
  }

  // useEffect(() => {
  //   if (!window.ethereum) {
  //     toast.error(
  //       'Install a crypto wallet(ex: Metamask, Coinbase, etc..) to proceed'
  //     )
  //   } else if (!chain) {
  //     toast.error('Connect Your Wallet.')
  //   } else {
  //     toast.success(`Welcome ${ellipseAddress(address)} !!`)
  //     getAdmin()
  //   }
  //   setDone(true)
  // }, [chain]) 

  return (
    <nav className="flex items-center justify-between flex-wrap bg-[#040f13] px-2">
      <Link href="/">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Image className={style.img} src={logo} height={50} width={60} />
          <div className={style.logoText}>P.O.G</div>
        </div>
      </Link>
      
      <div className="">
        {openMenu && (
          <div className={style.headerItemsTab}>
            <div className={`text-sm justify-end `}>
                <ConnectButton chainStatus="icon"  />
              </div>
          </div>
        )}

      </div>
      {/* <div className="block lg:hidden">
        <button onClick={handleBtnClick} className="flex items-center px-3 py-2 border rounded text-[#ffffff] border-[#ffffff] hover:text-white hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
        </button>
      </div> */}
    </nav>

  )
}

export default Header
