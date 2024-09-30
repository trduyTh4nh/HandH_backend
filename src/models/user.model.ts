import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../types/type.all";

const COLLECTION_NAME: string = "users";
const DOCUMENT_NAME: string = "user";

export const userAddressSchema: Schema = new Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipcode: { type: String },
  apartmentNumber: { type: String },
});

const userSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    birthDay: { type: String },
    phone: { type: String },
    userAddress: userAddressSchema,
    role: {
      type: Array,
      default: [],
    },
    avatar: { type: String },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const User = mongoose.model<IUser>(DOCUMENT_NAME, userSchema);

export default User;
