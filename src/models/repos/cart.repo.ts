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
  const { quantity, product, size, color }: any = cartDetail;
  const foundCart = await findCartById(idCart);

  if (!foundCart) {
    throw new BadRequestError("Can not find cart to add!");
  }

  const checkProductExists = foundCart.cart_products.find((pro: any) => {
    return (
      pro.product._id.toString() === product._id?.toString() &&
      pro.size.size === size.size &&
      pro.color.color === color.color
    );
  });

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
      .includes(color.color);

    if (!checkColor) {
      throw new BadRequestError("The color does not exist in this product!");
    }

    const checkSize = productFound.product_sizes
      .map((e) => e.size_name)
      .includes(size.size);

    var colorPro: any;
    let imageOfColor: any = productFound.product_colors.find((colorProduct) => {
      console.log("color product: ", colorProduct);
      colorPro = colorProduct;
      return colorProduct.color_code === color;
    });

    console.log("image of color: ", colorPro);

    if (colorPro) {
      cartDetail.image = colorPro.image_product_col ?? "";
    } else {
      cartDetail.image = "";
    }

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

  console.log(
    "foundCart.cart_products.length: ",
    foundCart.cart_products.length
  );
  if (foundCart.cart_products.length === 0) {
    foundCart.cart_total_price = 0;
    foundCart.cart_count = 0;
  } else {
    updateCart(foundCart);
  }
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

    console.log("cartItem: ", cartItem);
    const productCartUpdate: IProduct = await findProductById(
      cartItem.product._id.toString()
    );
    console.log("productCartUpdate: ", productCartUpdate);
    const priceProduct =
      productCartUpdate.product_price +
      productCartUpdate.product_sizes.find(
        (s) => (s.size_name = cartItem.size.size)
      )?.size_price! +
      productCartUpdate.product_colors.find(
        (c) => c.color_code === cartItem.color.color
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

const increaseQuantityProductInCartFunc = async (
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

  cartItem.quantity += 1;

  console.log("cartItem: ", cartItem);
  const productCartUpdate: IProduct = await findProductById(
    cartItem.product._id.toString()
  );
  const priceProduct =
    productCartUpdate.product_price +
    productCartUpdate.product_sizes.find(
      (s) => (s.size_name = cartItem.size.size)
    )?.size_price! +
    productCartUpdate.product_colors.find(
      (c) => c.color_code === cartItem.color.color
    )?.color_price!;

  cartItem.priceCartDetail = cartItem.quantity * priceProduct;

  updateCart(foundCart);
  return await foundCart.save();
};

const getAllCartDetailOfUserFunc = async (idUser: string): Promise<any> => {
  const cartUser = await findCartByIdUser(idUser);

  return {
    cart: cartUser,
  };
};

const removeMannyCartdetailInCartFunc = async (
  idCart: string,
  cartDetails: string[]
) => {
  const findCartToRemove = await Cart.findOne({ _id: idCart });

  if (!findCartToRemove) {
    throw new Error("Cart not found");
  }

  const updatedCartProducts = findCartToRemove.cart_products.filter(
    (cartDetail) => !cartDetails.includes(cartDetail._id!.toString())
  );

  findCartToRemove.cart_products = updatedCartProducts;

  findCartToRemove.cart_products.forEach((e) => {
    console.log("id: ", e._id);
  });

  return await findCartToRemove.save();
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
  increaseQuantityProductInCartFunc,
  removeMannyCartdetailInCartFunc,
};
