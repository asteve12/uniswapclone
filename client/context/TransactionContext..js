import { createContext } from "react";
import {useState,useEffect} from "react"


export const TransactionContext = createContext()
let eth;

if (typeof window !== "undefined") {
    eth = window.ethereum;
}

export const TransactionProvider = ({ children }) => {
    const [currentAcct, setCurrentAccount] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setformData] = useState({
        addressTo: "",
        amount:""
    })
    useEffect(() => {
        checkIfWalletIsConnected()
    },[])

    const connectWallet = async (metamask = eth) => {
        try {
            if (!metamask) return alert("Please install metamask")
            const accounts = await metamask.request({ method: "eth_requestAccounts" })
            setCurrentAccount(accounts[0])
        }
        catch (e) {
            console.error(e)
            throw new Error("No ethereum object")
        }
        
        
    }

    const checkIfWalletIsConnected = async (metamask = eth) => {
        try {
            if (!metamask) return alert("Please install metamask")
            const accounts = await metamask.request({ method: "eth_accounts" })
            
            if (accounts.length) {

                setCurrentAccount(accounts[0])
            }
            
        } catch (e) {
            console.error(e)
            throw new Error("No ethereum object")
            
        }
    }

    const sendTransaction = async (
        metamask = eth,
        connectedAcct = currentAcct) => {
        try {
            if (!metamask) return alert("Please install metamask")
            const { addressTo, amount } = formData
            const transactionContract = getEthereumContract()
            const parseAmount = ethers.utils.parseEther(amount)

            await metamask.request({
                method: "eth_sendTransaction",
                params: [
                    {
                        from: connectedAcct,
                        to: addressTo,
                        gas: "0x7EF40",
                        value:parseAmount._hex,
                    }
                ]
            })

            const transactionHash = await transactionContract
                .publishTransaction(
                    addressTo,
                    parseAmount,
                    `Transfering ETH  ${parseAmount} to ${addressTo} `,
                    "TRANSFER"
                    
            )
            setIsLoading(true)
            await transactionHash.wait();
            // await saveTransaction(
            //     transactionHash.hash,
            //     amount,
            //     connectedAcct,
            //     addressTo
            // )

            setIsLoading(false)
        }
        catch (e) {
            console.error(e)
        }
      


        
    }

    const handleChange = (e, name) => {
        setformData({
            
        })
        
    }

    return <TransactionContext.Provider
            value={{
                currentAcct,
            connectWallet,
            sendTransaction,
                

        }}
        >
            {children}
        </TransactionContext.Provider> 
    
}

