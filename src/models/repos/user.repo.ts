import { IUser, IUserData } from "../../types/type.all"
import User from "../user.model"

const findUserByEmail = async (email: string): Promise<IUser | null> => {
    const user = await User.findOne({ email: email })
    return user
}

const findUserByEmail_ = async (email: string): Promise<IUser | null> => {
    const user = await User.findOne({ email: email })
    return user
}



export {
    findUserByEmail,
    findUserByEmail_
}