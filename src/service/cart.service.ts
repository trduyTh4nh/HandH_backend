import { BadRequestError } from "../core/error.response";
import Cart from "../models/cart.model";
import Category from "../models/category.model";
import {
  addProductIntoCartFunc,
  createCartFunc,
  decreaseQuantityProductInCartFunc,
  findCartById,
  getAllCartDetailOfUserFunc,
  increaseQuantityProductInCartFunc,
  removeMannyCartdetailInCartFunc,
  removeProductInCartFunc,
  updateCart,
} from "../models/repos/cart.repo";
import { findProductById } from "../models/repos/product.repo";
import { ICart, ICartDetail, IProduct } from "../types/type.all";

class CartService {
  static async createCart(cart: ICart): Promise<any> {
    return await createCartFunc(cart);
  }
  static async addProductIntoCart(
    idProduct: string,
    idCart: string,
    size: string,
    color: string
  ): Promise<any> {
    const productAdd: IProduct = await findProductById(idProduct);

    console.log("product: ", productAdd);

    if (!productAdd) {
      throw new Error("Product not found.");
    }

    console.log({
      product_size_price: productAdd.product_sizes.find(
        (s) => s.size_name === size
      )?.size_price!,
      product_size_name: productAdd.product_sizes.find(
        (s) => s.size_name === size
      )?.size_name,
      product_color_price: productAdd.product_colors.find(
        (c) => c.color_code === color
      )?.color_price!,
      product_color_name: productAdd.product_colors.find(
        (c) => c.color_code === color
      )?.color_code!,
      product_price: productAdd.product_price,
    });

    const priceProduct =
      productAdd.product_price +
      productAdd.product_sizes.find((s) => s.size_name === size)?.size_price! +
      productAdd.product_colors.find((c) => c.color_code === color)
        ?.color_price!;

    const priceSize = productAdd.product_sizes.find((s) => s.size_name === size)
      ?.size_price!;

    const priceColor = productAdd.product_colors.find(
      (c) => c.color_code === color
    )?.color_price!;

    const getCategory = await Category.findOne({
      _id: productAdd.product_category,
    });

    const cartDetail: any = {
      product: {
        _id: productAdd._id,
        name_product: productAdd.product_name,
        category_product: getCategory?.category_name,
        thumb_product: productAdd.product_thumb,
        price_product: productAdd.product_price,
      },
      quantity: 1,
      size: { size: size, priceSize: priceSize },
      color: { color: color, priceColor: priceColor },
      priceCartDetail: priceProduct,
    };

    const foundCartDetail = await Cart.findOne({
      _id: idCart,
      cart_products: {
        $elemMatch: {
          "product._id": productAdd._id,
          size: size,
          color: color,
        },
      },
    });

    // nếu sản phẩn đó đã tồn tại đồng nghĩa là người dùng tăng số lượng sản phẩm
    if (foundCartDetail) {
      const cartDetailToUpdate = foundCartDetail.cart_products.find(
        (detail) =>
          detail.product._id.toString() === productAdd._id?.toString() &&
          detail.size === size &&
          detail.color === color
      );

      if (cartDetailToUpdate) {
        // Cập nhật số lượng và giá tiền
        cartDetailToUpdate.quantity += 1;
        cartDetailToUpdate.priceCartDetail =
          priceProduct * cartDetailToUpdate.quantity;

        // Lưu lại thay đổi
        updateCart(foundCartDetail);
        await foundCartDetail.save();
        return foundCartDetail;
      }
    }

    return await addProductIntoCartFunc(cartDetail, idCart);
  }
  static async removeProductInCart(
    idCartDetail: string,
    idCart: string
  ): Promise<any> {
    return await removeProductInCartFunc(idCartDetail, idCart);
  }

  static async decreaseQuantityProductInCart(
    idCartDetail: string,
    idCart: string
  ): Promise<any> {
    return await decreaseQuantityProductInCartFunc(idCartDetail, idCart);
  }

  static async increaseQuantityProductInCart(
    idCartDetail: string,
    idCart: string
  ): Promise<any> {
    return await increaseQuantityProductInCartFunc(idCartDetail, idCart);
  }

  static async getCartOfUser(idUser: string): Promise<any> {
    if (!idUser) {
      throw new BadRequestError("Missing user to get cart!");
    }
    return await getAllCartDetailOfUserFunc(idUser);
  }

  static async removeManyCartDetailsInCart(
    idCart: string,
    idCartDetails: string[]
  ): Promise<any> {
    if (!idCart) {
      throw new BadRequestError("Missing idCart to remove manny product!");
    }

    return await removeMannyCartdetailInCartFunc(idCart, idCartDetails);
  }
}

export default CartService;
