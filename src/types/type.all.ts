import mongoose, { Document, Types } from "mongoose";

export interface IUserAddress {
    _id?: Types.ObjectId
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
    apartmentNumber?: string;
}


export interface ICart extends Document {
    _id?: Types.ObjectId
    cart_user: mongoose.Types.ObjectId;
    cart_products: ICartDetail[];
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
    role?: string
}

export interface IProduct extends Document {
    _id?: Types.ObjectId
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
    product_sizes: ISizeProductVarication[];
    product_colors: IColorProductVariation[];
    product_stock: number
}


export interface IKeyTokenModel  {
    _id?: Types.ObjectId
    user: mongoose.Types.ObjectId,
    privateKey: string,
    publicKey: string,
    refreshTokenUsed?: any,
    refreshToken?: string
}

interface IUserData {
    _id?: Types.ObjectId
    email: string;
    password: string;
    name: string;
    birthDay?: string;
    phone: string;
    userAddress?: IUserAddress;
}

export interface IColorProductVariation {
    color_code: string,
    color_price: number,
    color_isPicked: boolean
}

export interface ISizeProductVarication {
    size_name: string,
    size_price: number
    size_isPicked: boolean
}


export interface ICategory extends Document {
    _id?: Types.ObjectId
    category_name: string,
    category_description: string,
    category_image: string,
    category_total: number
}
// đang tạo biết thế
export {
    IUserData
}




// interface IProduct extends Document {
//     _id?: Types.ObjectId
//     product_name: string,
//     product_thumb: string,
//     product_description: string,
//     product_price: number,
//     product_slug?: string,
//     product_rating?: number,
//     product_variations?: any,
//     isDraft: boolean,
//     isPublished: boolean,
//     isModified: (product_name: string) => boolean,
//     product_category: mongoose.Types.ObjectId;
// }