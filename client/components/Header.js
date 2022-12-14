import { useState, useEffect,useContext } from "react"
import Image from "next/image"
import { FiArrowUpRight } from "react-icons/fi"
import { AiOutlineDown } from "react-icons/ai"
import { HiOutlineDotsVertical } from "react-icons/hi"
import ethLogo from "../assets/eth.png"
import uniswapLogo from "../assets/uniswap.png"
import { TransactionContext } from "../context/TransactionContext"

// sk2lVotHenoKCprAnE0JBkUrjZy0uVNt5soBQh3ANKUQIucXSxHqG97of9iv57kYclfEvRQCAdikPGE0jOD6hodHAVbO99lKeyVcuKVf2nmmw4MUaQ3Rp2oyLS8uNbat88xEWNUL6Tv1nG0PVdWKII7YpkVrQ34E4yUASaqIiFXwKtzjIlYH
const style = {
    wrapper: `p-4 w-screen flex justify-center md:justify-between items-center`,
    headerLogo: `hidden md:hidden w-1/4 items-center justify-start lg:flex `,
    nav: `flex-1 flex  justify-center width-100 items-center md:justify-between `,
    navItemsContainer: `flex bg-[#191B1F] rounded-3xl  left-auto md:absolute md:top-[-100]  lg:absolute lg:bottom-0 lg:left-10 `,
    navItem: `px-auto py-auto m-1 flex items-center  text-10px md:text-lg md:px-4 md:py-2 font-semibold text-[0.9rem] cursor-pointer rounded-3xl`,
    activeNavItem: `bg-[#20242A]`,
    buttonsContainer: `hidden  md:flex flex w-1/4 justify-end items-center`,
    button: `flex  md:flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer`,
    buttonPadding: `p-2`,
    buttonTextContainer: `h-8 flex items-center`,
    buttonIconContainer: `flex items-center justify-center w-8 h-8`,
    buttonAccent: `bg-[#172A42] border border-[#163256] hover:border-[#234169] h-full rounded-2xl flex items-center justify-center text-[#4F90EA]`,
  }

const Header = () => {
    const [selectedNav, setSelectedNav] = useState("swap")
    const { currentAcct, connectWallet } = useContext(TransactionContext)
    const [userName, setUserName] = useState()
    
    useEffect(() => {
        if (!currentAcct) return;
        setUserName(`${currentAcct.slice(0, 7)}...${currentAcct.slice(35)}`)
        
    },[currentAcct])
    return (
        <div className={style.wrapper}>
            <div className={style.headerLogo}>
                <Image src={uniswapLogo} alt="uniswap" height={48} width={48}></Image>

            </div>
            <div className={style.nav}>
                <div className={style.navItemsContainer}>
                    <div onClick={() => setSelectedNav("swap")} className={`${style.navItem}  
                    ${selectedNav === "swap" && style.activeNavItem}`}>
                        Swap
                    </div>
                    <div onClick={() => setSelectedNav("pool")} className={`${style.navItem}  
                    ${selectedNav === "pool" && style.activeNavItem}`}>
                        Pool
                    </div>
                    <div onClick={() => setSelectedNav("vote")} className={`${style.navItem}  
                    ${selectedNav === "vote" && style.activeNavItem}`}>
                        Vote
                    </div>
                    <a href="https://info.uniswap.org/#/"
                        target="_blank"
                        rel="noreferrer" 
                    >
                        <div className={style.navItem}>
                            Charts <FiArrowUpRight></FiArrowUpRight>
                        </div>
                    </a>
                </div>
               
               
            </div>
            <div className={style.buttonsContainer}>
                <div className={`${style.button} ${style.buttonPadding}`}>
                    <div className={style.buttonIconContainer}>
                        <Image src={ethLogo} alt="eth logo" height={20} width={20} ></Image>
                    </div>
                    <p>Ethereum</p>
                    <div className={style.buttonIconContainer}>
                       <AiOutlineDown></AiOutlineDown> 
                    </div>
                </div>
                {currentAcct ?
                    (<div className={`${style.button} ${style.buttonPadding}`}>
                        <div className={style.buttonTextContainer}>{userName}</div>
                </div>
                )
                 : (
                     <div
                     onClick={() => connectWallet()}
                     className={`${style.button} ${style.buttonPadding}`}
                 >
                     <div className={`${style.buttonAccent} ${style.buttonPadding}`}>
                         Connect Wallet
                     </div>
 
                 </div>
                )}
               

                <div className={`${style.button}  ${style.buttonPadding}`}>
                    <div className={`${style.buttonIconContainer} mx-2`}>
                        <HiOutlineDotsVertical/>
                    </div>
                </div>

            </div>

            <section className="flex top-20 absolute md:hidden lg:hidden ">
                
            {currentAcct ?
                    (<div className={`${style.button} ${style.buttonPadding}`}>
                        <div className={style.buttonTextContainer}>{userName}</div>
                </div>
                )
                 : (
                     <div
                     onClick={() => connectWallet()}
                     className={`${style.button} ${style.buttonPadding}`}
                 >
                     <div className={`${style.buttonAccent} ${style.buttonPadding}`}>
                         Connect Wallet
                     </div>
 
                 </div>
                )}
            </section>

        </div>
    )
}


export default Header