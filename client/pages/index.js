import Header from '../components/Header'
import Main from '../components/main'
import TransactionHistory from '../components/transactionHistory'
//https://www.youtube.com/watch?v=dkE4mVhwMB4
const style = {
  wrapper: `min-h-screen box-border  w-screen bg-[#2D242F] text-white select-none flex flex-col justify-between`,
}

const Home = () => {
  return (
    <div className={style.wrapper}>
      <Header />
      <Main />
      <TransactionHistory />
    </div>
  )
}

export default Home