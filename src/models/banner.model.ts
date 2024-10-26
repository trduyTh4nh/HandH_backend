import mongoose, { Schema } from "mongoose";
import { IBanner } from "../types/type.all";

const COLLECTION_NAME: string = "banner";
const DOCUMENT_NAME: string = "banner";

const bannerSchema: Schema = new Schema<IBanner>(
  {
    url: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    products: {
      type: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const Banner = mongoose.model<IBanner>(DOCUMENT_NAME, bannerSchema);

export default Banner;

//https://console.firebase.google.com/u/0/project/handh-storage/settings/general/web:M2JmZmVkOTEtYTY3Zi00MDM5LWJmNGYtY2UyODFiMjQyODkw?nonce=1726670436815
