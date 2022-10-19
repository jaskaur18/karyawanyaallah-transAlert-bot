import { Router } from '@grammyjs/router'
import { createWalletAddress } from '@/models/walletAddress'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

const addWallet = new Router<Context>((ctx) => ctx.session?.route)

addWallet.route('addWallet', (ctx: Context) => {
  const message = ctx.msg?.text
  if (!message) return ctx.reply('Invalid Input /cancel To Cancel')

  if (message === '/cancel') {
    ctx.session.route = ''
    return ctx.reply('Canceled')
  }

  //check if message is wallet address
  if (message.length !== 42) {
    return ctx.reply('Invalid Input /cancel To Cancel')
  }

  //check if wallet address is valid
  if (message.slice(0, 2) !== '0x') {
    return ctx.reply('Invalid Input /cancel To Cancel')
  }

  ctx.session.route = 'addNickName'
  ctx.session.walletAddress = message
  return ctx.reply('Enter Nick Name /cancel To Cancel')
})

addWallet.route('addNickName', (ctx: Context) => {
  const message = ctx.msg?.text
  if (!message) return ctx.reply('Invalid Input /cancel To Cancel')

  if (message === '/cancel') {
    ctx.session.route = ''
    return ctx.reply('Canceled')
  }

  ctx.session.route = 'addAlertToChatId'
  ctx.session.nickName = message
  return ctx.reply('Enter Alert To Chat Id /cancel To Cancel')
})

addWallet.route('addAlertToChatId', async (ctx: Context) => {
  const message = ctx.msg?.text
  if (!message) return ctx.reply('Invalid Input /cancel To Cancel')

  if (message === '/cancel') {
    ctx.session.route = ''
    return ctx.reply('Canceled')
  }

  //if message is not a number
  if (isNaN(+message)) {
    return ctx.reply('Invalid Input Must Be Numberimage.png /cancel To Cancel')
  }

  ctx.session.alertToChatId = +message

  //add wallet to database
  const wallet = await createWalletAddress(
    //random 6 digit number
    Math.floor(100000 + Math.random() * 900000),
    'matic',
    ctx.session.walletAddress,
    ctx.session.nickName,
    ctx.session.alertToChatId
  )

  if (!wallet) {
    ctx.session.route = ''
    return ctx.reply('Error Cannot Add Wallet')
  }

  ctx.session.route = ''
  const _message =
    `Id: <code>${wallet.id}</code>\n\n` +
    `Chain Id: <code>${wallet.chainId}</code>\n\n` +
    `Wallet Address: <code>${wallet.walletAddress}</code>\n` +
    `Nick Name: <b>${wallet.nickName}</b>\n` +
    `Alert To Chat Id: <code>${wallet.alertToChatId}</code>\n` +
    `Total Alert Send: <code>${wallet.totalAlertSend}</code>\n\n` +
    `Wallet Added Successfully To Listner`

  return ctx.reply(_message, sendOptions(ctx))
})

export default addWallet
