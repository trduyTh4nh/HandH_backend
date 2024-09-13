import { BadRequestError } from "../core/error.response";
import { addProductIntoCartFunc, createCartFunc, decreaseQuantityProductInCartFunc, getAllCartDetailOfUserFunc, removeProductInCartFunc } from "../models/repos/cart.repo";
import { findProductById } from "../models/repos/product.repo";
import { ICart, ICartDetail, IProduct } from "../types/type.all";

class CartService {
    static async createCart(cart: ICart): Promise<any> {
        return await createCartFunc(cart)
    }
    static async addProductIntoCart(idProduct: string, idCart: string, size: string, color: string): Promise<any> {
        const productAdd: IProduct = await findProductById(idProduct)
        const priceProduct = (productAdd.product_price + productAdd.product_sizes.find((s) => s.size_name = size)?.size_price! + productAdd.product_colors.find((c) => c.color_code === color)?.color_price!)

        console.log("Product price origin: ", productAdd.product_price)
        console.log("Product price with variants: ", priceProduct)
        const cartDetail: any = {
            product: productAdd,
            quantity: 1,
            size: size,
            color: color,
            priceCartDetail: priceProduct
        }
        return await addProductIntoCartFunc(cartDetail, idCart)
    }
    static async removeProductInCart(idCartDetail: string, idCart: string): Promise<any> {
        return await removeProductInCartFunc(idCartDetail, idCart)
    }

    static async decreaseQuantityProductInCart(idCartDetail: string, idCart: string): Promise<any> {
        return await decreaseQuantityProductInCartFunc(idCartDetail, idCart)
    }

    static async getCartOfUser(idUser: string) : Promise<any> {
        if(!idUser){
            throw new BadRequestError("Missing user to get cart!")
        }
        return await getAllCartDetailOfUserFunc(idUser)
    }
}

export default CartService