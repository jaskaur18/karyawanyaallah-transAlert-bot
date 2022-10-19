import Context from '@/models/Context'
import getTrans from '@/utils/ethers/getTrans'
import sendOptions from '@/helpers/sendOptions'

export default async function handleHelp(ctx: Context) {
  await getTrans()
  // await createWalletAddress(
  //   //random 6 digit number
  //   Math.floor(100000 + Math.random() * 900000),
  //   'matic',
  //   '0xb8ca0f5851a410d2092b777782bbf07f93939400',
  //   'test',
  //   ctx.from?.id || 0
  // )
  return ctx.reply('help', sendOptions(ctx))
}
