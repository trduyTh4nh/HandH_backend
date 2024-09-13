import { BadRequestError } from "../../core/error.response"
import { IProduct, IUser, IUserData } from "../../types/type.all"
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

const findUserById = async (_id: string): Promise<IUser | null> => {
    return await User.findOne({
        _id: _idConverted(_id)
    })
}


const updateInfoUser = async (user: IUser, idUser: string): Promise<any> => {
    const {
        email,
        name,
        birthDay,
        phone,
        userAddress
    } = user


    const updateData: Partial<IUser> = {}

    if (email) {
        const checkMail = await User.findOne({ email })
        if(checkMail){
            throw new BadRequestError("Email is in use!")
        }

        updateData.email = email
    }
    if(name) updateData.name = name
    if(birthDay) updateData.birthDay = birthDay
    if(phone) updateData.phone = phone  
    if(userAddress) updateData.userAddress = userAddress      // cái này nếu k được thì có thể làm api update địa chỉ riêng


    if(Object.keys(updateData).length > 0){
        const updateUser = await User.findByIdAndUpdate(_idConverted(idUser), updateData, {new: true})

        return updateUser
    }
    else {
        throw new BadRequestError("Not data to update")
    }

}



export {
    findUserByEmail,
    findUserByEmail_,
    findUserById,
    updateInfoUser
}