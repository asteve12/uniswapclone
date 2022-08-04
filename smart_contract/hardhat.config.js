require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config({path:__dirname+'/.env'})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    rinkeby: {
      url: process.env.NEXT_PUBLIC_RPC,
      accounts:[process.env.NEXT_PUBLIC_PRIVATEkEY]
   } 
  },
  solidity: "0.8.9",
};
