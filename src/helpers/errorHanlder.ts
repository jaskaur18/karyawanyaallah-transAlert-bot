import { BotError, GrammyError, HttpError } from 'grammy'
import AdminIds from '@/helpers/constant'
import bot from '@/helpers/bot'

export default function errorHanlder(err: BotError) {
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}:`)
  const e = err.error
  if (e instanceof GrammyError) {
    if (e.error_code === 403)
      return console.log(`${ctx.from?.first_name} Blocked The Bot`)

    if (e.error_code === 400) return console.log(`Chat/User Not Found`)

    err.ctx.reply('Oh Error Happened').catch(console.log)
    AdminIds.map((adminId: string) => {
      const errMsg =
        `Error Happned ${ctx.from?.first_name}\n` +
        `Id - ${ctx.from?.id} Username - ${ctx.from?.username}\n` +
        `${e.message}`
      return bot.api
        .sendMessage(adminId, errMsg)
        .catch((err) => console.log('Some Error Ignore It' + err.error_code))
    })
    console.error('Error in request:', e.description)
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e)
  } else {
    console.error('Unknown error:', e)
  }
}
