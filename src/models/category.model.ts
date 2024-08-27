'use strict'

import mongoose, { model, Schema } from "mongoose"
import Product from "./product.model"
import { BadRequestError } from "../core/error.response"
import { ICategory } from "../types/type.all"

const COLLECTION_NAME: string = 'categories'
const DOCUMENT_NAME: string = 'category'

const categorySchema: Schema = new Schema<ICategory>({
    category_name: {
        type: String,
        required: true
    },
    category_description: {
        type: String,
        required: true
    },
    category_image: {
        type: String,
        required: true
    },
    category_total: {
        type: Number
    }
    
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})


categorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const categoryId = this._id
        await Product.deleteMany({ product_category: categoryId })
        next()
    } catch (error: any) {
        var err: any = error.message
        throw new BadRequestError(err, 400)
    }
})


const Category = mongoose.model<ICategory>(DOCUMENT_NAME, categorySchema)
export default Category