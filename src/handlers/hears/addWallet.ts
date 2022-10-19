import Context from '@/models/Context'

export default function handleaddWallet(ctx: Context) {
  ctx.session.route = 'addWallet'
  return ctx.reply('Please send me your wallet address')
}
