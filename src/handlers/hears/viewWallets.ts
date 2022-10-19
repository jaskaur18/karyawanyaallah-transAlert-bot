import { Menu, MenuRange } from '@grammyjs/menu'
import {
  deleteWalletById,
  getAllWallets,
  getWalletById,
} from '@/models/walletAddress'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export const viewWalletsMenu = new Menu<Context>('viewWalletsMenu')
export const deleteWalletsMenu = new Menu<Context>('deleteWalletsMenu').dynamic(
  async (ctx, range) => {
    const wallet = await getWalletById(ctx.session.walletId)
    if (!wallet) await ctx.answerCallbackQuery('Something Went Wrong')
    else
      range.text(
        { text: 'Delete This Wallet', payload: `${wallet.id}` },
        async (ctx) => {
          await deleteWalletById(ctx.session.walletId)
          await ctx.answerCallbackQuery('Wallet Deleted')
          return ctx.editMessageText('Wallet Delete')
        }
      )
  }
)

viewWalletsMenu.dynamic(async () => {
  const wallets = await getAllWallets()

  const range = new MenuRange<Context>()
  wallets.map((wallet) => {
    range
      .text(
        {
          text: `${wallet.nickName} - ${wallet.walletAddress}`,
          payload: `${wallet.id}`,
        },
        viewWallet
      )
      .row()
  })
  return range
})

async function viewWallet(ctx: Context) {
  const walletId = ctx.match

  if (walletId === null || walletId === undefined)
    return ctx.answerCallbackQuery('Something Went Wrong')

  const wallet = await getWalletById(+walletId)

  ctx.session.walletId = +walletId

  if (wallet === null) {
    return ctx.answerCallbackQuery('Something Went Wrong')
  }

  const message =
    `Id: <code>${wallet.id}</code>\n\n` +
    `Chain Id: <code>${wallet.chainId}</code>\n\n` +
    `Wallet Address: <code>${wallet.walletAddress}</code>\n` +
    `Nick Name: <b>${wallet.nickName}</b>\n` +
    `Alert To Chat Id: <code>${wallet.alertToChatId}</code>\n` +
    `Total Alert Send: <code>${wallet.totalAlertSend}</code>`

  await ctx.answerCallbackQuery(`Viewing Wallet ${wallet.nickName}`)
  return ctx.editMessageText(message, {
    parse_mode: 'HTML',
    reply_markup: deleteWalletsMenu,
  })
}

export default async function handleViewWallets(ctx: Context) {
  const wallets = await getAllWallets()

  if (wallets.length === 0) {
    return ctx.reply(
      `Currently No Wallet Are Being Tracked By The Bot`,
      sendOptions(ctx)
    )
  }

  return ctx.reply('All Wallets That Are Currently Being Tracked', {
    ...sendOptions(ctx),
    reply_markup: viewWalletsMenu,
  })
}
