// import { addWalletAddress } from '@/utils/ethers/subcribeWallet'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class walletAddress {
  @prop({ required: true, index: true, unique: true })
  id!: number

  @prop({ required: false, default: 'matic' })
  chainId!: string

  @prop({ required: true, lowercase: true })
  walletAddress!: string

  @prop({ required: true })
  nickName!: string

  @prop({ required: true })
  alertToChatId!: number

  @prop({ required: true, default: 0 })
  totalAlertSend!: number
}

const walletAddressModel = getModelForClass(walletAddress)

//function to create a new walletAddress
export async function createWalletAddress(
  id: number,
  chainId: string,
  walletAddress: string,
  nickName: string,
  alertToChatId: number
) {
  // addWalletAddress(walletAddress)
  return await walletAddressModel.create({
    id,
    chainId,
    walletAddress,
    nickName,
    alertToChatId,
  })
}

//get all wallets
export async function getAllWallets(): Promise<walletAddress[]> {
  return await walletAddressModel.find()
}

//get by id
export async function getWalletById(id: number): Promise<walletAddress | null> {
  return await walletAddressModel.findOne({ id })
}

//get all wallets by walletAddress
export async function getWalletsByWalletAddress(
  walletAddress: string
): Promise<walletAddress[]> {
  return await walletAddressModel.find({ walletAddress })
}

//delete by id
export async function deleteWalletById(
  id: number
): Promise<walletAddress | null> {
  return await walletAddressModel.findOneAndDelete({ id })
}

//get all unique walletAddress
export async function getAllWalletAddress() {
  return await walletAddressModel.find()
}

//change totalAlertSend
export async function updateTotalAlertSend(id: number, totalAlertSend: number) {
  return await walletAddressModel.updateOne({ id }, { totalAlertSend })
}
