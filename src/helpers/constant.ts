import Moralis from 'moralis'
import env from '@/helpers/env'

export const walletAddress: string[] = []

const AdminIds: string[] = env.ADMIN_IDS.split(',')
export default AdminIds
