import { NextFunction } from "express";
import mongoose, { Document, Schema, Types } from "mongoose";
import slugify from "slugify";
import Comment from "./comments.model";
import { BadRequestError } from "../core/error.response";
import { IProduct } from "../types/type.all";
const COLLECTION_NAME: string = "products";
const DOCUMENT_NAME: string = "product";

export const productSchema: Schema = new Schema<IProduct>(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_slug: {
      type: String,
      unique: true,
      index: true,
    },
    product_rating: {
      type: Number,
      default: 2,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must below 5"],
      set: (val: number) => Math.round(val * 10) / 10,
    },

    isDraft: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    product_category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    product_sizes: {
      type: [
        {
          size_name: { type: String, required: true },
          size_price: { type: Number, required: true },
          size_isPicked: { type: Boolean, default: false },
        },
      ],
    },
    product_colors: {
      type: [
        {
          color_code: { type: String, required: true },
          color_price: { type: Number, required: true },
          color_isPicked: { type: Boolean, default: false },
          image_product_col: { type: String },
        },
      ],
    },
    product_stock: {
      type: Number,
      default: 0,
    },
    product_images: {
      type: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

productSchema.index({ product_name: "text" });

productSchema.pre<IProduct>("save", function (next) {
  const product: IProduct = this;
  product.product_slug = slugify(product.product_name, { lower: true });
  next();
});

// middle ware delete cascade comment when delete product
productSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const productId = this._id;
      await Comment.deleteMany({ comment_product: productId });
    } catch (error: any) {
      const err: any = error.message;
      throw new BadRequestError(err, 400);
    }
  }
);
const ProductModel = mongoose.model<IProduct>(DOCUMENT_NAME, productSchema);

export default ProductModel;
