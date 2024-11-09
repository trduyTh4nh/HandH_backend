import { BadRequestError } from "../../core/error.response";
import { ICart, ICartDetail, IProduct, IUser } from "../../types/type.all";
import { _idConverted } from "../../utils";
import Cart from "../cart.model";
import ProductModel from "../product.model";
import User from "../user.model";
import { findProductById } from "./product.repo";
import { findUserById } from "./user.repo";

const createCartFunc = async (cart: ICart): Promise<any> => {
  const { cart_user } = cart;

  const foundUser: IUser | null = await findUserById(cart_user.toString());
  if (!foundUser) {
    throw new BadRequestError("Not found user to create a cart!");
  }
  const cartCreated = await Cart.create(cart);
  return cartCreated;
};

const addProductIntoCartFunc = async (
  cartDetail: ICartDetail,
  idCart: string
): Promise<any> => {
  const { quantity, product, size, color } = cartDetail;
  const foundCart = await findCartById(idCart);

  if (!foundCart) {
    throw new BadRequestError("Can not find cart to add!");
  }

  const checkProductExists = foundCart.cart_products.find(
    (pro) =>
      pro.product.toString() === product._id?.toString() &&
      pro.size === size &&
      pro.color === color
  );

  if (checkProductExists) {
    checkProductExists.quantity += 1;
    checkProductExists.priceCartDetail =
      checkProductExists.quantity * cartDetail.priceCartDetail;
  } else {
    const productFound: IProduct | null = await ProductModel.findOne({
      _id: product._id,
    });
    if (!productFound) {
      throw new BadRequestError("Can not find product to add!");
    }
    const checkColor = productFound.product_colors
      .map((e) => e.color_code)
      .includes(color);
    if (!checkColor) {
      throw new BadRequestError("The color does not exist in this product!");
    }
    const checkSize = productFound.product_sizes
      .map((e) => e.size_name)
      .includes(size);
    if (!checkSize) {
      throw new BadRequestError("The size does not exist in this product!");
    }
    foundCart.cart_products.push(cartDetail);
  }

  foundCart.cart_count = foundCart.cart_products
    .map((e) => e.quantity)
    .reduce((prev, acc) => acc + prev);
  foundCart.cart_total_price = foundCart.cart_products
    .map((e) => e.priceCartDetail)
    .reduce((prev, acc) => acc + prev);

  console.log("quantity: ", foundCart.cart_products[0].quantity);
  console.log("priceCartDetail: ", foundCart.cart_products[0].priceCartDetail);

  const cartAdded = await foundCart.save();

  return cartAdded;
};

// tại sao phải có màu và size,
// do màu và size khác thì nó là một sản phẩm khác trong giỏ hàng và giá nó cũng khác nhau r
const removeProductInCartFunc = async (
  idCartDetail: string,
  idCart: string
): Promise<any> => {
  const foundCart = await findCartById(idCart);
  console.log("idCartDetail: ", idCartDetail);
  if (!foundCart) {
    throw new BadRequestError("Can not find cart to remove product!");
  }
  foundCart.cart_products = foundCart.cart_products.filter(
    (cartItem) => cartItem._id?.toString() !== idCartDetail.toString()
  );
  updateCart(foundCart);
  return await foundCart.save();
};

export const updateCart = (cart: ICart): void => {
  cart.cart_count = cart.cart_products
    .map((e) => e.quantity)
    .reduce((prev, acc) => acc + prev);
  cart.cart_total_price = cart.cart_products
    .map((e) => e.priceCartDetail)
    .reduce((prev, acc) => acc + prev);
};
const findCartById = async (id: string) => {
  return await Cart.findOne({
    _id: _idConverted(id),
  });
};

// giảm số lượng trong cart

const decreaseQuantityProductInCartFunc = async (
  idCartDetail: string,
  idCart: string
): Promise<any> => {
  const foundCart = await findCartById(idCart);
  console.log("idCartDetail: ", idCartDetail);
  if (!foundCart) {
    throw new BadRequestError("Can not find cart to remove product!");
  }

  const cartItem = foundCart.cart_products.find(
    (cartItem) => cartItem._id?.toString() === idCartDetail
  );

  if (!cartItem) {
    throw new BadRequestError("Cart detail not found in the cart!");
  }

  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
    const productCartUpdate: IProduct = await findProductById(
      cartItem.product.toString()
    );
    const priceProduct =
      productCartUpdate.product_price +
      productCartUpdate.product_sizes.find((s) => (s.size_name = cartItem.size))
        ?.size_price! +
      productCartUpdate.product_colors.find(
        (c) => c.color_code === cartItem.color
      )?.color_price!;

    cartItem.priceCartDetail = cartItem.quantity * priceProduct;
  } else {
    foundCart.cart_products = foundCart.cart_products.filter(
      (cartItem) => cartItem._id?.toString() !== idCartDetail.toString()
    );
  }

  updateCart(foundCart);
  return await foundCart.save();
};
const getAllCartDetailOfUserFunc = async (idUser: string): Promise<any> => {
  const cartUser = await findCartByIdUser(idUser);

  return {
    cart: cartUser,
  };
};

const findCartByIdUser = async (idUser: string): Promise<ICart | null> => {
  return await Cart.findOne({ cart_user: _idConverted(idUser) });
};

export {
  addProductIntoCartFunc,
  createCartFunc,
  findCartById,
  removeProductInCartFunc,
  decreaseQuantityProductInCartFunc,
  findCartByIdUser,
  getAllCartDetailOfUserFunc,
};
