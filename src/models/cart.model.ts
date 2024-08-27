import mongoose, { Schema } from "mongoose";
import { ICart } from "../types/type.all";

const COLLECTION_NAME: string = 'cart'
const DOCUMENT_NAME: string = 'cart'



// cart detail

interface ICartDetail extends Document {
    product_id: mongoose.Types.ObjectId,
    quantity: number
}

const cartDetailSchema: Schema = new Schema<ICartDetail>({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    _id: false
})

// cart 
// interface ICart {
//     cart_user: mongoose.Types.ObjectId,
//     cart_products: ICartDetail[],
//     cart_count: number,
//     cart_status: string,
// }

const cartSchema: Schema = new Schema<ICart>({
    cart_user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    cart_products: {
        type: [cartDetailSchema],
        required: true,
        default: []
    },
    cart_count: {
        type: Number,
        default: 0
    },
    cart_status: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const Cart = mongoose.model<ICart>(DOCUMENT_NAME, cartSchema)


export default Cart