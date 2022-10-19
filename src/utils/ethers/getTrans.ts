import { BigNumber } from 'ethers'
import { EvmChain } from '@moralisweb3/evm-utils'
import { getWalletsByWalletAddress } from '@/models/walletAddress'
import { walletAddress } from '@/helpers/constant'
import InputDataDecoder from 'ethereum-input-data-decoder'
import Moralis from 'moralis'
import axios from 'axios'
import bot from '@/helpers/bot'
import tokenAbi from '@/utils/contract/tokenAbi.json'

const chain = EvmChain.BSC

const decoder = new InputDataDecoder(tokenAbi)

const usedTransHash: string[] = []

//sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const checkNewTrans = async () => {
  try {
    //loop though all walletAddress
    for (const address of walletAddress) {
      //get all transaction of walletAddress
      const getWalletTrans = await Moralis.EvmApi.transaction
        .getWalletTransactions({
          address,
          chain,
          limit: 1,
        })
        .catch(() => {
          console.log(`error getWalletTransactions`)
        })

      if (!getWalletTrans) return

      const txHash = getWalletTrans.result[0].hash

      await sleep(10 * 1000)

      //if txHas in usedTransHash, skip
      if (usedTransHash.includes(txHash)) {
        return
      }

      console.log(`new txHash: ${txHash}`)

      const trans = await Moralis.EvmApi.transaction
        .getTransaction({
          transactionHash: txHash,
          chain,
        })
        .catch((e) => {
          console.log(`Can't Get TransData err -> ${e}`)
        })

      if (!trans) {
        console.log(`can't get the trans ${trans}`)

        return
      }
      await sleep(5 * 1000)

      const from = trans.result.from.lowercase
      const contractAddress = trans.result.to?.lowercase

      const result = decoder.decodeData(trans.raw.input)
      if (!result.inputs.length && !trans.result.value) {
        console.log(`No Input And No Value`)

        return
      }

      const to = !result.inputs.length
        ? trans.result.to?.lowercase || ''
        : `0x${result.inputs[0]}`.toLowerCase()

      const value: BigNumber = !result.inputs.length
        ? trans.result.value?.toString()
        : result.inputs[1]

      const sendOrReceive = address === contractAddress ? 'receive' : 'send'

      if (from !== address && to !== address) {
        console.log(`from !== address && to !== address`)

        return
      }

      let amount = (Number(value) / 10 ** 18).toFixed(4)
      let symbol = 'BSC'
      let decimals = 18
      let tokenPriceUsd = 0

      if (to.toLowerCase() !== contractAddress?.toLowerCase()) {
        await sleep(10 * 1000)
        const tokenData = await Moralis.EvmApi.token
          .getTokenMetadata({
            addresses: [contractAddress || ''],
            chain,
          })
          .catch((err) => {
            console.log(`can't get token data`)
          })
        await sleep(2 * 1000)

        if (!tokenData) {
          console.log(`can't get token data`)

          return
        }
        symbol = tokenData.result[0].token.symbol
        decimals = tokenData.result[0].token.decimals
        amount = (Number(value) / 10 ** decimals).toFixed(8)

        try {
          await sleep(5 * 1000)
          const response = await Moralis.EvmApi.token.getTokenPrice({
            address: contractAddress || '',
            chain: '0x38',
          })
          tokenPriceUsd = response.raw.usdPrice || 0
        } catch (e) {
          console.log(e)

          console.log(`Can't get token price`)
        }
      } else {
        const tokenPriceUSD = await axios.get(
          `https://api.coinbase.com/v2/exchange-rates?currency=MATIC`
        )
        tokenPriceUsd = tokenPriceUSD.data.data.rates.USD || 0
      }

      //if amout is 0 then return
      if (Number(amount) === 0) return

      //remove all 0 after last number
      amount = amount.replace(/\.?0+$/, '')

      const transAmountUsd = Number(Number(amount) * tokenPriceUsd).toFixed(4)
      // .replace(/\.?0+$/, '')

      //add txHash to usedTransHash
      usedTransHash.push(txHash)

      console.log({
        contractAddress,
        sendOrReceive,
        toAddress: to,
        fromAddress: from,
        txHash,
        symbol,
        decimals,
        amount,
        transAmountUsd,
      })
      await sleep(4 * 1000)
      await sendMessage(
        sendOrReceive,
        to,
        from,
        txHash,
        symbol,
        amount,
        transAmountUsd
      )
    }
  } catch (e) {
    console.log(`Some Error`)
  }
}

const sendMessage = async (
  sendOrReceive: 'send' | 'receive',
  toAddress: string,
  fromAddress: string,
  txHash: string,
  symbol: string,
  amount: string,
  transAmountUsd: string
) => {
  const wallets = await getWalletsByWalletAddress(
    sendOrReceive === 'send' ? fromAddress : toAddress
  )

  //compress toAddress like 0x98db..ef8b
  const toAddressCompress = `${toAddress.slice(0, 6)}...${toAddress.slice(-6)}`
  //compress fromAddress like 0x98db..ef8b
  const fromAddressCompress = `${fromAddress.slice(0, 6)}...${fromAddress.slice(
    -6
  )}`

  for (const wallet of wallets) {
    const chatId = wallet.alertToChatId
    const nickName = wallet.nickName
    const totalAlertSend = wallet.totalAlertSend

    let message = `*${nickName}*
    \n*From Address:* ${fromAddress}
    \n*Total Alert Send:* ${totalAlertSend}`

    console.log(`sending message to ${chatId}`)

    if (sendOrReceive === 'send') {
      const senderExits = await getWalletsByWalletAddress(toAddress)

      const senderNickName = senderExits.length
        ? senderExits[0].nickName
        : toAddressCompress

      message =
        `Polygon Network\n\n` +
        `<b>${nickName}</b>\n\n` +
        `Sent: <a href=""> ${amount} ${symbol}</a> (~$${transAmountUsd}) To: ${senderNickName} \n\n` +
        `<a href="https://polygonscan.com/tx/${txHash}">Tx hash</a>`
    } else {
      const receiverExits = await getWalletsByWalletAddress(fromAddress)

      const receiverNickName = receiverExits.length
        ? receiverExits[0].nickName
        : fromAddressCompress

      message =
        `Polygon Network\n\n` +
        `<b>${nickName}</b>\n\n` +
        `Received: <a href=""> ${amount} ${symbol}</a> (~$${transAmountUsd}) From: ${receiverNickName} \n\n` +
        `<a href="https://polygonscan.com/tx/${txHash}">Tx hash</a>`
    }

    await bot.api
      .sendMessage(chatId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      })
      .catch(() => {
        console.log(`Can't send message to ${chatId}`)
      })
  }
}

export default checkNewTrans
