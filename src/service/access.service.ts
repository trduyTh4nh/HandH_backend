import { AuthFailureError, BadRequestError } from "../core/error.response";
import { findUserByEmail, findUserByEmail_ } from "../models/repos/user.repo";
import User from "../models/user.model";
import { IKeyTokenModel, IUser, IUserData } from "../types/type.all";
import bcrypt from "bcrypt"
import crypto from "crypto"
import { errorWriteDown } from "../utils";
import env from 'dotenv'
import KeyTokenService from "./keytoken.service";
import mongoose from "mongoose";
import { createTokenPair } from "../auth/auth";
env.config()

class AccessService {
    static async register(payload: IUserData): Promise<any> {
        const roleUser: string | undefined = process.env.ROLEUSER
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
                userAddress: userAddress,
                role: roleUser
            })
            // // Access the _id field
            // console.log('User ID:', user._id);

            if (user) {

                const privateKey = crypto.randomBytes(64).toString("hex")
                const publicKey = crypto.randomBytes(64).toString("hex")

                console.log({ privateKey, publicKey })

                const idUser = new mongoose.Types.ObjectId(user._id + "");

                const keyData: IKeyTokenModel = {
                    user: idUser,
                    publicKey: publicKey,
                    privateKey: privateKey,
                }


                const keyStore = await KeyTokenService.createToken(keyData)

                if (!keyStore) {
                    return {
                        code: "102",
                        message: "ketStore error!"
                    }
                }
                const tokens = await createTokenPair({ userId: user._id, email }, privateKey, publicKey)
                console.log(`Create token success::`, tokens)

                const result: any = {
                    email: user.email,
                    name: name,
                    birthDay: birthDay,
                    userAddress: userAddress,
                    phone: phone,
                }

                return {
                    code: 201,
                    metadata: {
                        user: result,
                        tokens: tokens
                    }
                }

            }
            else {
                throw new BadRequestError('Can not create user!', 400);
            }


        } catch (error) {
            var _error: string = errorWriteDown(error)
            throw new BadRequestError(_error);
        }
    }

    // chưa done
    static async login(email: string, password: string, refreshToken: string): Promise<any> {

        const foudnUser = await findUserByEmail_(email);
        if (!foudnUser) {
            throw new BadRequestError("User not register!")
        }

        const match: boolean = await bcrypt.compare(password, foudnUser.password)

        if (!match) {
            throw new AuthFailureError("Authentication error")
        }

        const privateKey: string = crypto.randomBytes(64).toString("hex")
        const publicKey: string = crypto.randomBytes(63).toString("hex")

        const idUser: any = foudnUser._id

        console.log("User id: ", idUser)
        const tokens: IKeyTokenModel = await createTokenPair({ user: idUser, email: email }, privateKey, publicKey)

        await KeyTokenService.createToken({
            refreshToken: tokens.refreshToken,
            privateKey: privateKey,
            publicKey: publicKey,
            user: idUser
        })

        return {
            user: foudnUser,
            tokens: tokens
        }
    }


}

export default AccessService