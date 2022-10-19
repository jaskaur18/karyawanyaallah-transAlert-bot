import { Bot, webhookCallback } from 'grammy'
import { run } from '@grammyjs/runner'
import Context from '@/models/Context'
import env from '@/helpers/env'
import errorHanlder from '@/helpers/errorHanlder'
import express from 'express'

const production = async (bot: Bot<Context>) => {
  try {
    await bot.api.setWebhook(`${env.RAILWAY_STATIC_URL}`)
    const app = express() // or whatever you're using
    app.use(express.json()) // parse the JSON request body
    app.use(webhookCallback(bot, 'express'))
    app.listen(80, () => {
      console.log(`Webhook Server Start At - 80`)
    })
    console.info(`Bot ${bot.botInfo.username} is up and running`)
  } catch (e) {
    console.error(e)
  }
}

const development = async (bot: Bot<Context>): Promise<void> => {
  try {
    await bot.api.deleteWebhook()

    // Errors
    bot.catch(errorHanlder)

    // Start bot
    await bot.init()
    const runner = run(bot)
    console.info(`Bot ${bot.botInfo.username} is up and running`)

    //Stop The Bot When Process Stops
    const stopRunner = () => runner.isRunning() && runner.stop()
    process.once('SIGINT', stopRunner)
    process.once('SIGTERM', stopRunner)
  } catch (e) {
    console.error(e)
  }
}

export { production, development }
