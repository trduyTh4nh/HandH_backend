import { IUser, IUserData } from "../../types/type.all"
import { _idConverted } from "../../utils"
import User from "../user.model"

const findUserByEmail = async (email: string): Promise<IUser | null> => {
    const user = await User.findOne({ email: email })
    return user
}

const findUserByEmail_ = async (email: string): Promise<IUser | null> => {
    const user = await User.findOne({ email: email })
    return user
}

const findUserById = async(_id: string): Promise<IUser | null> => {
    return await User.findOne({
        _id: _idConverted(_id)
    })
}




export {
    findUserByEmail,
    findUserByEmail_,
    findUserById
}