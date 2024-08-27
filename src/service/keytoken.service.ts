import mongoose from "mongoose";
import { BadRequestError } from "../core/error.response";
import TokenModel from "../models/keytoken.model";
import { IKeyTokenModel } from "../types/type.all";
import { errorWriteDown } from "../utils";

class KeyTokenService {

    static async createToken(payload: IKeyTokenModel): Promise<IKeyTokenModel | null> {
        const { user, publicKey, privateKey, refreshToken } = payload
        try {
            const tokens: IKeyTokenModel = await TokenModel.findOneAndUpdate(
                { user: user },
                { publicKey: publicKey, privateKey: privateKey, refreshTokenUsed: [], refreshToken: refreshToken },
                { upsert: true, new: true }
            )

            return tokens
        } catch (error) {
            var _error: string = errorWriteDown(error)
            throw new BadRequestError(_error, 400)
        }
    }

    static async findUserByIdUser(userId: string): Promise<IKeyTokenModel | null> {
        try {
            const userObjectId = new mongoose.Types.ObjectId(userId)
            return await TokenModel.findOne({ user: userObjectId })
        } catch (error) {
            var _error: string = errorWriteDown(error)
            throw new BadRequestError(_error, 400)
        }
    }

    static async removeKeyById(key: any) {
        const _id = new mongoose.Types.ObjectId(key)
        return await TokenModel.deleteOne({
            _id: _id
        }).lean()
    }

    static async findByRefreshTokenUsed(refreshToken: string) {
        return await TokenModel.findOne({
            refreshTokenUsed: refreshToken
        })
    }

    static async deleteKeyById(key: any) {
        const _id = new mongoose.Types.ObjectId(key)

        return await TokenModel.deleteOne({
            user: _id
        })
    }

    static async findTokenByRefreshToken(refreshToken: string) {
        return await TokenModel.findOne({
            refreshToken: refreshToken
        })
    }

    static async findKeyStoreById(_id: any): Promise<any> {
        return await TokenModel.findOne({
            _id: _id
        })
    }
}

export default KeyTokenService