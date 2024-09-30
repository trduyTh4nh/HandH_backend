import mongoose, { Schema } from "mongoose";
import { ICart, ICartDetail } from "../types/type.all";
import ProductModel from "./product.model";

const COLLECTION_NAME: string = "cart";
const DOCUMENT_NAME: string = "cart";

const cartDetailSchema: Schema = new Schema<ICartDetail>({
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "product",
    required: true,
  },
  priceCartDetail: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const cartSchema: Schema = new Schema<ICart>(
  {
    cart_user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    cart_products: {
      type: [cartDetailSchema],
      required: true,
      default: [],
    },
    cart_count: {
      type: Number,
      default: 0,
    },
    cart_status: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_total_price: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const Cart = mongoose.model<ICart>(DOCUMENT_NAME, cartSchema);

// const CartDetail = mongoose.model<ICartDetail>('cart_detail', cartDetailSchema)

// cartSchema.pre('deleteOne', { document: true, query: false }, async function () {
//     try {
//         const cartId = this._id
//         await CartDetail.deleteMany({  })
//     } catch (error) {

//     }
// })

export default Cart;
