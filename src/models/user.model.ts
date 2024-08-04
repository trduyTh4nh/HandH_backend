import mongoose, { Document, Schema } from 'mongoose';

const COLLECTION_NAME: string = 'users'
const DOCUMENT_NAME: string = 'user'


interface IUserAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
    apartmentNumber?: string;
}

interface IUser extends Document {
    email: string,
    password: string,
    name: string;
    birthDay?: string;
    phone: string;
    userAddress?: IUserAddress
}

const userAddressSchema: Schema = new Schema({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipcode: { type: String },
    apartmentNumber: { type: String }
})

const userSchema: Schema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    birthDay: { type: String },
    phone: { type: String },
    userAddress: userAddressSchema
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const User = mongoose.model<IUser>(DOCUMENT_NAME, userSchema)

export default User