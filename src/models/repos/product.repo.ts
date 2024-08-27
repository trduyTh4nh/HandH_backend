import { IProduct } from "../../types/type.all";
import ProductModel from "../product.model";


const getAllProducts = async (): Promise<IProduct[] | null> => {
    const products = await ProductModel.find({})
    return products
}

const crearteProductFunc = async (
    product: IProduct
): Promise<IProduct> => {
    return await ProductModel.create(product)
}

export {
    getAllProducts,
    crearteProductFunc
}