import { StringNullableChain } from "lodash";
import mongoose, { Document, Types } from "mongoose";

export interface IUserAddress {
  _id?: Types.ObjectId;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  apartmentNumber?: string;
}

export interface IUser extends Document {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  birthDay?: string;
  phone: string;
  userAddress?: IUserAddress;
  role?: string;
  avatar?: string;
}

export interface IProduct extends Document {
  _id?: Types.ObjectId;
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_price: number;
  product_slug: string;
  product_rating: number;
  product_images: string[];
  isDraft: boolean;
  isPublished?: boolean;
  // isModified: (product_name: string) => boolean;
  product_category: mongoose.Types.ObjectId;
  product_sizes: ISizeProductVarication[];
  product_colors: IColorProductVariation[];
  product_stock: number;
}

export interface IKeyTokenModel {
  _id?: Types.ObjectId;
  user: mongoose.Types.ObjectId;
  privateKey: string;
  publicKey: string;
  refreshTokenUsed?: any;
  refreshToken?: string;
}

interface IUserData {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  birthDay?: string;
  phone: string;
  userAddress?: IUserAddress;
}

export interface IColorProductVariation {
  color_code: string;
  color_price: number;
  color_isPicked: boolean;
  image_product_col: string;
}

export interface ISizeProductVarication {
  size_name: string;
  size_price: number;
  size_isPicked: boolean;
}

export interface ICategory extends Document {
  _id?: Types.ObjectId;
  category_name: string;
  category_description: string;
  category_image: string;
  category_total: number;
}
// đang tạo biết thế
export { IUserData };

export interface IBanner extends Document {
  _id?: Types.ObjectId;
  url: string;
  isActive: boolean;
  title: string;
  content: string;
  products: string[];
  isMain: boolean;
}

export interface IWishList extends Document {
  userId: Types.ObjectId;
  products: IProduct[];
}

export interface ITypeFilter {
  latestProduct: boolean;
  bestSeller: boolean;
  pricesFilter: { price: number; isUp: boolean };
  minimumPrice: number;
  maximumPrice: number;
  isSortByPrice: boolean;
  sizesFilter: [];
  colorsFilter: [];
}

export interface IPayment extends Document {
  _id?: Types.ObjectId;
  status: string;
  totalPrice: number;
  cartId: Types.ObjectId;
  paymentMethod: string;
  billingAddress: IUserAddress;
  description: string;
  currency: string;
  qr: string;
  user: Types.ObjectId;
}

export interface IPaymentHistory extends Document {
  _id?: Types.ObjectId;
  paymentId: Types.ObjectId;
  userId: Types.ObjectId;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  transactionDate: Date;
  billingAddress: IUserAddress;
  currency: string;
  description?: string;
}

// ----------------

export interface ICart extends Document {
  _id?: Types.ObjectId;
  cart_user: mongoose.Types.ObjectId;
  cart_products: ICartDetail[];
  cart_count: number;
  cart_status: string;
  cart_total_price: number;
}

export interface ICartDetail extends Document {
  _id?: Types.ObjectId;
  quantity: number;
  product: any;
  priceCartDetail: number;
  size: string;
  color: string;
  isPicked: boolean;
}

export interface IOrder extends Document {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  products: IOrderProduct[];
  cartId?: Types.ObjectId;
  totalPrice: number;
  shippingAddress: IUserAddress;
  paymentMethod: string;
  orderStatus: string;
  shippingCost: number;
  taxAmount: number;
  discount: number;
  orderDate: Date;
  notes: string;
}

// Define the product structure within an order
export interface IOrderProduct {
  productId: Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
  size?: string;
  color?: string;
}

export interface IBlogPost extends Document {
  _id?: Types.ObjectId;
  content: string;
  author: string;
  images: string[];
  datePosted: string;
  dateEdited?: string;
}

export enum EPaymentMethod {
  CASH = "cash",
  VNPAY = "vnpay",
}

export enum EStatusOrder {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  PACKING = "packing",
}
