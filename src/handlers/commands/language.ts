import Context from '@/models/Context'
import languageMenu from '@/menus/language'
import sendOptions from '@/helpers/sendOptions'

export default function handleLanguage(ctx: Context) {
  return ctx.reply('language', {
    ...sendOptions(ctx),
    reply_markup: languageMenu,
  })
}
