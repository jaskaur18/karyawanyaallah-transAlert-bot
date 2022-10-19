import { session as session_ } from 'grammy'

export interface Session {
  route: string
  nickName: string
  walletAddress: string
  chainId: string
  alertToChatId: number
  walletId: number
}

export const initial = (): Session => ({
  route: '',
  nickName: '',
  walletAddress: '',
  chainId: '',
  alertToChatId: 0,
  walletId: 0,
})

export const session = session_({ initial })
