import mongoose, { Schema } from "mongoose";
import { IPayment } from "../types/type.all";
import { userAddressSchema } from "./user.model";

const COLLECTION_NAME: string = "payment";
const DOCUMENT_NAME: string = "payment";

const paymentSchema: Schema = new Schema<IPayment>(
  {
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refuned"],
      default: "pending",
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "cart",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    billingAddress: {
      type: userAddressSchema,
      required: true,
    },
    description: {
      type: String,
    },
    currency: {
      type: String,
      required: true,
    },
    qr: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const PaymentModel = mongoose.model<IPayment>(DOCUMENT_NAME, paymentSchema);
export default PaymentModel;
