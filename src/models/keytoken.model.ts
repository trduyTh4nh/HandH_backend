import mongoose, { Schema } from "mongoose"

const DOCUMENT_NAME = 'key'
const COLLECTION_NAME = 'keys'


interface IKeyTokenModel {
    user: mongoose.Types.ObjectId,
    privateKey: string,
    publicKey: string,
    refreshTokenUsed: any,
    refreshToken: string
}

const tokenSchema = new Schema<IKeyTokenModel>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop',
    },
    privateKey: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    refreshTokenUsed: {
        type: Array, default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const TokenModel = mongoose.model<IKeyTokenModel>(DOCUMENT_NAME, tokenSchema)

export default TokenModel