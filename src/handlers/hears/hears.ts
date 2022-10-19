import { Composer } from 'grammy'
import Context from '@/models/Context'
import handleViewWallets from '@/handlers/hears/viewWallets'
import handleaddWallet from '@/handlers/hears/addWallet'

const HearsHanlder = new Composer<Context>()

HearsHanlder.hears('View Wallets', handleViewWallets)
HearsHanlder.hears('Add Wallet', handleaddWallet)

export default HearsHanlder
