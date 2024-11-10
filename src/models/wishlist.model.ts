import mongoose, { Schema } from "mongoose";
import { IWishList } from "../types/type.all";
import { productSchema } from "./product.model";

const COLLECTION_NAME: string = "wishlist";
const DOCUMENT_NAME: string = "wishlist";

const wishlistSchema: Schema = new Schema<IWishList>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: {
      type: [Object],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const WishListModel = mongoose.model<IWishList>(DOCUMENT_NAME, wishlistSchema);

export default WishListModel;
