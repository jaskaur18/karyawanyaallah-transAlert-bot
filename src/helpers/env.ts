import * as dotenv from 'dotenv'
import { cleanEnv, str } from 'envalid'

dotenv.config()

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  TOKEN: str(),
  MONGO: str(),

  HTTP_URL_MATIC: str(),
  WS_URL_MATIC: str(),

  MORALIS_API_KEY: str(),

  ADMIN_IDS: str(),
  RAILWAY_STATIC_URL: str(),
})
