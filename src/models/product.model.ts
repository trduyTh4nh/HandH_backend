import { NextFunction } from "express";
import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";
import Comment from "./comments.model";
import { BadRequestError } from "../core/error.response";
const COLLECTION_NAME: string = 'products'
const DOCUMENT_NAME: string = 'product'

interface IProduct extends Document {
    product_name: string,
    product_thumb: string,
    product_description: string,
    product_price: number,
    product_slug: string,
    product_rating: number,
    product_variations: any,
    isDraft: boolean,
    isPublished: boolean,
    isModified: (product_name: string) => boolean,
    product_category: mongoose.Types.ObjectId;
}

const productSchema: Schema = new Schema<IProduct>({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_slug: {
        type: String,
        unique: true,
        index: true
    },
    product_rating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must below 5'],
        set: (val: number) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: [Schema.Types.Mixed],
    },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    product_category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

productSchema.pre<IProduct>('save', function (next) {
    const product: IProduct = this
    product.product_slug = slugify(product.product_name, { lower: true })
    next()
})

// middle ware delete cascade comment when delete product
productSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const productId = this._id
        await Comment.deleteMany({ comment_product: productId })
    } catch (error: any) {
        var err: any = error.message
        throw new BadRequestError(err, 400)
    }
})
const Product = mongoose.model<IProduct>(DOCUMENT_NAME, productSchema)

export default Product


