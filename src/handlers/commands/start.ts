import Context from '@/models/Context'
import mainKeyboard from '@/menus/mainKeyboard'
import sendOptions from '@/helpers/sendOptions'

export default function handleStart(ctx: Context) {
  return ctx.reply(ctx.t('welcome'), {
    ...sendOptions(ctx),
    reply_markup: mainKeyboard,
  })
}
