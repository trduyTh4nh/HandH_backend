import mongoose, { Collection, model, Schema } from "mongoose"

const DOCUMENT_NAME = 'comment'
const COLLECTION_NAME = 'comments'

interface IComment extends Document {
    content: string,
    comment_user: mongoose.Types.ObjectId,
    comment_product: mongoose.Types.ObjectId,
    isUpdate: boolean
}

const commentSchema: Schema = new Schema<IComment>({
    content: {
        type: String,
    },
    comment_user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comment_product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    isUpdate: {
        type: Boolean,
        default: false
    }

}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const Comment = mongoose.model<IComment>(DOCUMENT_NAME, commentSchema)

export default Comment