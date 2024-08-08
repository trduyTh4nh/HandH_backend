import { BadRequestError } from "../core/error.response";
import { findUserByEmail } from "../models/repos/user.repo";
import User from "../models/user.model";
import { IUser } from "../types/type.all";
import bcrypt from "bcrypt"
import { errorWriteDown } from "../utils";
class AccessService {
    static async register(payload: IUser): Promise<IUser | null> {
        const { email, password, name,
            birthDay, phone, userAddress } = payload

        const foudnUser = await findUserByEmail(email)
        if (foudnUser) {
            throw new BadRequestError('User already exists!')
        }

        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const user = await User.create({
                email: email,
                password: hashedPassword,
                name: name,
                birthDay: birthDay,
                phone: phone,
                userAddress: userAddress
            })

            return user

        } catch (error) {
            var _error: string = errorWriteDown(error)
            throw new BadRequestError(_error, 400);
        }
    }
}

export default AccessService