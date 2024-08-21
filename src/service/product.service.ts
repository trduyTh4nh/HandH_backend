import { getAllProducts } from "../models/repos/product.repo";

class ProductService {
    static async getAllProduct(): Promise<any> {
        const listProduct = await getAllProducts()
        return listProduct
    }
}

export default ProductService