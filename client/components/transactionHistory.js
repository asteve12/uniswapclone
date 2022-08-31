import { useEffect, useState } from 'react'
import { client } from '../lib/sanityClient'
import { useContext } from 'react'
import { TransactionContext } from '../context/TransactionContext'
import Image from 'next/image'
import ethLogo from '../assets/ethCurrency.png'
import { FiArrowUpRight } from 'react-icons/fi'

const style = {
  wrapper: `h-full text-white box-border select-none  text-center w-full flex-1  flex items-end justify-end  px-8  md:w-auto   `,
  txHistoryItem: `bg-[#191a1e] rounded-lg px-4 py-2 my-2 flex  justify-center flex-col w-full md:flex-row md:w-auto lg:w-auto`,
  txDetails: `flex items-center w-full justify-center md:w-auto md:flex-end`,
  toAddress: `text-[#f48706] mx-2  `,
  txTimestamp: `mx-2 flex justify-center md:justify-end`,
  etherscanLink: `flex items-center text-[#2172e5] justify-center md:justify-end`,
}

const TransactionHistory = () => {
  const { isLoading, currentAcct } = useContext(TransactionContext)
  const [transactionHistory, setTransactionHistory] = useState ([]) 

  useEffect(() => {
      ; (async () => {
      if (!isLoading && currentAcct) {
        const query = `
          *[_type=="users" && _id == "${currentAcct}"] {
            "transactionList": transactions[]->{amount, toAddress, timestamp, txHash}|order(timestamp desc)[0..4]
          }
        `

        const clientRes = await client.fetch(query)

        setTransactionHistory(clientRes[0].transactionList)
      }
    })()
  }, [isLoading, currentAcct])

  return (
    <div className={style.wrapper}>
      <div className="w-full md:w-auto" >
        {transactionHistory &&
          transactionHistory?.map((transaction, index) => (
            <div className={style.txHistoryItem} key={index}>
              <div className={style.txDetails}>
                <Image src={ethLogo} height={20} width={15} alt='eth' />
                {transaction.amount} Ξ sent to{' '}
                <span className={style.toAddress}>
                  {transaction.toAddress.substring(0, 6)}...
                </span>
              </div>{' '}
              on{' '}
              <div className={style.txTimestamp}>
                {new Date(transaction.timestamp).toLocaleString('en-US', {
                  timeZone: 'PST',
                  hour12: true,
                  timeStyle: 'short',
                  dateStyle: 'long',
                })}
              </div>
              <div className={style.etherscanLink}>
                <a
                  href={`https://rinkeby.etherscan.io/tx/${transaction.txHash}`}
                  target='_blank'
                  rel='noreferrer'
                  className={style.etherscanLink}
                >
                  View on Etherscan
                  <FiArrowUpRight />
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default TransactionHistory