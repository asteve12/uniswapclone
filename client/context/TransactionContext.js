import { createContext } from "react";
import {useState,useEffect} from "react"
import { ethers } from "ethers"
import { contractABI, contractAddress } from "../lib/constant"
import { client } from "../lib/sanityClient";
import { useRouter } from "next/router";

export const TransactionContext = createContext()

let eth;

if (typeof window !== "undefined") {
    eth = window.ethereum;
}
 
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(eth)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer,
    )
  
    return transactionContract
  }


export const TransactionProvider = ({ children }) => {
    const [currentAcct, setCurrentAccount] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setformData] = useState({
        addressTo: "",
        amount:""
    })
    const router = useRouter()
    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])
    
    useEffect(() => {
        if (!currentAcct) return;
        (async () => {
            const userDoc = {
                _types: "users",
                _id: currentAcct,
                userName: "Unnamed",
                address:currentAcct
            }

            await client.createIfNotExists(userDoc)
            
        })()

        
    },[currentAcct])

    useEffect(() => {
        if (isLoading) {
            router.push(`/?loading=${currentAcct}`)
            
            
        }
        else {
            router.push("/")
            
        }
        
    },[isLoading])

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
            await saveTransaction(
                transactionHash.hash,
                amount,
                connectedAcct,
                addressTo
            )

            setIsLoading(false)
        }
        catch (e) {
            console.error(e)
        }
      


        
    }

    const handleChange = (e, name) => {
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }))
        
        
    }

    const saveTransaction = async (
        txHash,
        amount,
        fromAddress = currentAcct,
        toAddress
    ) => {
        const txDoc = {
            _type: "transaction",
            _id: txHash,
            fromAddress: fromAddress,
            toAddress: toAddress,
            timestamp: new Date(Date.now()).toISOString(),
            txHash,
            amount:parseFloat(amount)
        }
        await client.createIfNotExists(txDoc)
        await client
            .patch(currentAcct)
            .setIfMissing({ transactions: [] })
            .insert("after", "transactions[-1]", [
                {
                    _key: txHash,
                    _ref: txHash,
                    _type:"refernce"
                }
            ]).commit()
        
        return;

        
    }



    return <TransactionContext.Provider
            value={{
            currentAcct,
            connectWallet,
            sendTransaction,
            handleChange,
            formData,
            isLoading
         }}
        >
            {children}
        </TransactionContext.Provider> 
    
}

