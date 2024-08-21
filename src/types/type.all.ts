import mongoose, { Document } from "mongoose";

export interface IUserAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
    apartmentNumber?: string;
}


export interface ICart extends Document {
    cart_user: mongoose.Types.ObjectId;
    cart_products: any;
    cart_count: number;
    cart_status: string;
}

export interface ICartDetail extends Document {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
}

export interface IUser extends Document {
    _id?: mongoose.Types.ObjectId; 
    email: string;
    password: string;
    name: string;
    birthDay?: string;
    phone: string;
    userAddress?: IUserAddress;
}

export interface IProduct extends Document {
    product_name: string;
    product_thumb: string;
    product_description: string;
    product_price: number;
    product_slug: string;
    product_rating: number;
    product_variations: any;
    isDraft: boolean;
    isPublished: boolean;
    isModified: (product_name: string) => boolean;
    product_category: mongoose.Types.ObjectId;
}


export interface IKeyTokenModel {
    user: mongoose.Types.ObjectId,
    privateKey: string,
    publicKey: string,
    refreshTokenUsed?: any,
    refreshToken?: string
}

interface IUserData {
    email: string;
    password: string;
    name: string;
    birthDay?: string;
    phone: string;
    userAddress?: IUserAddress;
}

export {
    IUserData
}