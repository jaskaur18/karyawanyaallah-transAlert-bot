import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'
import {
  deleteWalletsMenu,
  viewWalletsMenu,
} from '@/handlers/hears/viewWallets'
import { development, production } from '@/helpers/launch'
import { hydrate } from '@grammyjs/hydrate'
import { limit } from '@grammyjs/ratelimiter'
import { loadLocales } from '@/helpers/i18n'
import { session } from '@/helpers/session'
import CommandsHanlder from '@/handlers/commands'
import HearsHanlder from '@/handlers/hears/hears'
import addListners from '@/utils/ethers/subcribeWallet'
import addWallet from '@/conversation/addWallet'
import attachUser from '@/middlewares/attachUser'
import bot from '@/helpers/bot'
import checkNewTrans from '@/utils/ethers/getTrans'
import configurefluent from '@/middlewares/configurefluent'
import env from '@/helpers/env'
import languageMenu from '@/menus/language'
import startMongo from '@/helpers/startMongo'

async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  bot
    // Middlewares
    // .use(sequentialize())
    // .use(ignoreOld)
    .use(attachUser)
    .use(limit())
    .use(hydrate())
    // Add fluent middleware to the bot
    .use(configurefluent())
    //Session
    .use(session)
    // Menus
    .use(deleteWalletsMenu)
    .use(viewWalletsMenu)
    .use(languageMenu)
    //Routers Conversation
    .use(addWallet)
    // Commands
    .use(CommandsHanlder)
    .use(HearsHanlder)

  await addListners()
  await loadLocales()

  //interval every 1 min
  setInterval(async () => {
    await checkNewTrans()
  }, 2 * 60 * 1000)

  await (env.isDev ? development(bot) : production(bot))
}

void runApp()

