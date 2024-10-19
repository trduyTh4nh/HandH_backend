import mongoose, { Schema } from "mongoose";
import { IOrder } from "../types/type.all";
import { productSchema } from "./product.model";
import { userAddressSchema } from "./user.model";

const COLLECTION_NAME: string = "order";
const DOCUMENT_NAME: string = "order";

const orderSchema: Schema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: {
      type: [productSchema],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: userAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
    },
    taxAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const OrderModel = mongoose.model<IOrder>(DOCUMENT_NAME, orderSchema);
export default OrderModel;
