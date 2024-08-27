
import _ from 'lodash'
import JWT from 'jsonwebtoken'
import env from 'dotenv'
import { IUser } from '../types/type.all'
import mongoose from 'mongoose'
env.config()
const errorWriteDown = (error: any): string => {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return errorMessage
}

const getInfoData = ({ fields = [], object = {} }: { fields: string[], object: {} }) => {
    return _.pick(object, fields)
}

const verifyJWT = async (token: string, keySecret: string): Promise<any> => {
    return await JWT.verify(token, keySecret)
}

const adminPlayer = async (roleCurrent: string) => {
    return await roleCurrent === process.env.ROLEADMIN
}

const _idConverted = (_id: string) => {
    return new mongoose.Types.ObjectId(_id)
}
export {
    errorWriteDown,
    getInfoData,
    verifyJWT,
    adminPlayer,
    _idConverted
}