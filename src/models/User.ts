import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: true, index: true, unique: true })
  id!: number

  @prop({ required: false, default: 'none', lowercase: true })
  username!: string

  @prop({ required: true, lowercase: true })
  first_name!: string

  @prop({ required: false, lowercase: true })
  last_name!: string

  @prop({ required: true, default: 'en' })
  language!: string
}

const UserModel = getModelForClass(User)

export function findOrCreateUser(
  id: number,
  username: string | undefined,
  first_name: string,
  last_name: string | undefined
) {
  return UserModel.findOneAndUpdate(
    { id },
    { username, first_name, last_name },
    {
      upsert: true,
      new: true,
    }
  )
}
