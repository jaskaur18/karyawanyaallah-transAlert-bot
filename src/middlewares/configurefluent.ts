import { LocaleNegotiator, useFluent } from '@grammyjs/fluent'

import { fluent } from '@/helpers/i18n'
import Context from '@/models/Context'

const localeNegotiator = (ctx: Context) =>
  (ctx.chat && ctx.dbuser.language) || ctx.from?.language_code

const middleware = () => {
  return useFluent({
    fluent,
    localeNegotiator: localeNegotiator as LocaleNegotiator,
    defaultLocale: 'en',
  })
  // return next()
}
export default middleware
