import { BadRequestError } from "../core/error.response";
import { crearteProductFunc, getAllProducts } from "../models/repos/product.repo";
import { ICategory, IProduct } from "../types/type.all";

class ProductService {
    // nhớ phân trang khi lấy all product về
    static async getAllProduct(): Promise<any> {
        const listProduct = await getAllProducts()
        return listProduct
    }

    static async createProduct(
        product: IProduct
    ): Promise<any> {
        const {
            product_name, product_thumb, product_description,
            product_price, product_category, product_sizes,
            product_colors,
        } = product

        if (!product_name || !product_thumb || !product_description || !product_price || !product_category) {
            throw new BadRequestError("Missing required fields");
        }

        if (product_price <= 0) {
            throw new BadRequestError("Price must > 0")
        }

        return await crearteProductFunc(product)

    }

 
}

export default ProductService