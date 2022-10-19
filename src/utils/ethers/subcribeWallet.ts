// import { BigNumber } from 'ethers'
// import { EvmChain } from '@moralisweb3/evm-utils'
// import { Subscription } from 'web3-core-subscriptions'
// import {
//   getAllWalletAddress,
//   getWalletsByWalletAddress,
// } from '@/models/walletAddress'
// import { walletAddress } from '@/helpers/constant'
// import { web3http, web3ws } from '@/utils/ethers/maticProvider'
// import InputDataDecoder from 'ethereum-input-data-decoder'
// import Moralis from 'moralis'
// import bigNumber from 'bn.js'
// import bot from '@/helpers/bot'
// import env from '@/helpers/env'
// import tokenAbi from '@/utils/contract/tokenAbi.json'

import { getAllWalletAddress } from '@/models/walletAddress'
import { walletAddress } from '@/helpers/constant'
import Moralis from 'moralis'
import env from '@/helpers/env'

// const decoder = new InputDataDecoder(tokenAbi)

// class TransactionChecker {
//   web3
//   web3ws
//   subscription: Subscription<string> | undefined

//   constructor() {
//     this.web3ws = web3ws
//     this.web3 = web3http
//   }

//   subscribe(topic: 'pendingTransactions') {
//     this.subscription = this.web3ws.eth.subscribe(
//       topic,
//       (err: any, res: any) => {
//         if (err) console.error(err)
//       }
//     )
//   }

//   watchTransactions() {
//     console.log('Watching all pending transactions...')
//     if (!this.subscription) return
//     this.subscription.on('data', (txHash) => {
//       setTimeout(async () => {
//         try {
//           const tx = await this.web3.eth.getTransaction(txHash)
//           if (tx != null && tx.to && tx.from) {
//             if (
//               walletAddress.includes(tx.to.toLowerCase()) ||
//               walletAddress.includes(tx.from.toLowerCase())
//             ) {
//               const result = decoder.decodeData(tx.input)
//               if (!result.inputs.length) return

//               const sendOrReceive = walletAddress.includes(tx.to.toLowerCase())
//                 ? 'receive'
//                 : 'send'
//               tx
//               //get blockNumber
//               const blockNumber = await this.web3.eth.getBlockNumber()
//               const contractAddress = 'CONTRACT_ADDRESS'
//               const from = tx.from.toLowerCase()
//               const to: string = `0x${result.inputs[0]}`.toLowerCase()
//               const value: BigNumber = result.inputs[1]
//               const amount = value.toString()

//               //if to or from not in walletAddress return
//               if (
//                 !walletAddress.includes(to.toLowerCase()) &&
//                 !walletAddress.includes(from.toLowerCase())
//               )
//                 return
//               await sendMessage(
//                 tx.to.toLowerCase(),
//                 blockNumber,
//                 sendOrReceive,
//                 to,
//                 from,
//                 txHash,
//                 amount
//               )
//             }
//           }
//         } catch (err) {
//           console.error(err)
//         }
//       }, 60000)
//     })
//   }
// }

// const txChecker = new TransactionChecker()

// export default txChecker

export default async function addListners() {
  await Moralis.start({
    apiKey: env.MORALIS_API_KEY,
  }).then(() => {
    console.log('Moralis initialized')
  })

  const wallet = await getAllWalletAddress()
  //not if in walletAddress add wallet.walletAddress
  wallet.forEach((wallet) => {
    //if not in walletAddress add wallet.walletAddress
    if (!walletAddress.includes(wallet.walletAddress.toLowerCase())) {
      console.log(`added ${wallet.walletAddress} to walletAddress Listner`)
      walletAddress.push(wallet.walletAddress.toLowerCase())
    }
  })
}

// //add walletAddress to walletAddress if not in walletAddress
// export function addWalletAddress(_walletAddress: string) {
//   if (!walletAddress.includes(_walletAddress.toLowerCase())) {
//     walletAddress.push(_walletAddress.toLowerCase())
//   }
// }

// const sendMessage = async (
//   contractAddress: string,
//   blockNumber: number,
//   sendOrReceive: 'send' | 'receive',
//   toAddress: string,
//   fromAddress: string,
//   txHash: string,
//   value: string
// ) => {
//   const wallets = await getWalletsByWalletAddress(
//     sendOrReceive === 'send' ? fromAddress : toAddress
//   )

//   const chain = EvmChain.POLYGON

//   const response = await Moralis.EvmApi.token.getTokenMetadata({
//     addresses: [contractAddress],
//     chain,
//   })
//   const { symbol, decimals } = response.result[0].token

//   const amount = (Number(value) / 10 ** decimals).toFixed(8)
// ˘
//   console.log({
//     contractAddress,
//     blockNumber,
//     sendOrReceive,
//     toAddress,
//     fromAddress,
//     txHash,
//     symbol,
//     decimals,
//   })
//   console.log(wallets)

//   // return

//   wallets.forEach(async (wallet) => {
//     const chatId = wallet.alertToChatId
//     const nickName = wallet.nickName
//     const totalAlertSend = wallet.totalAlertSend
//     let message = `*${nickName}*
//     \n*From Address:* ${fromAddress}
//     \n*Value:* ${value}
//     \n*Total Alert Send:* ${totalAlertSend}`

//     console.log(`sending message to ${chatId}`)

//     if (sendOrReceive === 'send') {
//       const senderExits = await getWalletsByWalletAddress(toAddress)

//       const senderNickName = senderExits.length
//         ? senderExits[0].nickName
//         : toAddress

//       message =
//         `Polygon Network\n\n` +
//         `<b>${nickName}</b>\n\n` +
//         `Sent: <a href=""> ${amount} ${symbol}</a> (~$Usd Here) To: ${senderNickName} \n\n` +
//         `Block: <a href="https://polygonscan.com/block/${blockNumber}">${blockNumber}</a> \n` +
//         `<a href="https://polygonscan.com/tx/${txHash}">Tx hash</a>`
//     } else {
//       const receiverExits = await getWalletsByWalletAddress(fromAddress)

//       const receiverNickName = receiverExits.length
//         ? receiverExits[0].nickName
//         : toAddress

//       message =
//         `Polygon Network\n\n` +
//         `<b>${nickName}</b>\n\n` +
//         `Received: <a href=""> ${amount} ${symbol}</a> (~$Usd Here) From: ${receiverNickName} \n\n` +
//         `Block: <a href="https://polygonscan.com/block/${blockNumber}">${blockNumber}</a> \n` +
//         `<a href="https://polygonscan.com/tx/${txHash}">Tx hash</a>`
//     }

//     await bot.api.sendMessage(chatId, message, {
//       parse_mode: 'HTML',
//       disable_web_page_preview: true,
//     })
//   })
// }
