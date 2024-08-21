import { IProduct } from "../../types/type.all";
import ProductModel from "../product.model";


const getAllProducts = async (): Promise<IProduct[] | null> => {
    const products = await ProductModel.find({})
    return products
}   


export {
    getAllProducts
}