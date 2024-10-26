import { SuccessResponse } from "../core/success.response";
import CartService from "../service/cart.service";
import CategoryService from "../service/category.service";
import { ICart } from "../types/type.all";
import { NextFunction, Request, Response } from "../types/type.express";

class CartController {
  createCart = async (req: Request, res: Response, next: NextFunction) => {
    const cart: ICart = req.body.cart;
    new SuccessResponse({
      message: "Create cart successfully!",
      metadata: await CartService.createCart(cart),
    }).send(res);
  };

  addProductToCart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const idCart: string = req.body.idCart;
    const idProduct: string = req.body.idProduct;
    const sizeProduct: string = req.body.sizeProduct;
    const colorProduct: string = req.body.colorProduct;

    new SuccessResponse({
      message: "Add product to cart successfully!",
      metadata: await CartService.addProductIntoCart(
        idProduct,
        idCart,
        sizeProduct,
        colorProduct
      ),
    }).send(res);
  };

  removeProductInCart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const idCartDetail = req.body.cartDetail;
    const idCart = req.body.cart;

    new SuccessResponse({
      message: "Remove product in cart successfully!",
      metadata: await CartService.removeProductInCart(idCartDetail, idCart),
    }).send(res);
  };

  decreaseQuantity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const idCartDetail = req.body.cartDetail;
    const idCart = req.body.cart;

    new SuccessResponse({
      message: "Decrease quantity successfully!",
      metadata: await CartService.decreaseQuantityProductInCart(
        idCartDetail,
        idCart
      ),
    }).send(res);
  };

  getCartOfUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.params.id;

    new SuccessResponse({
      message: "Get cart for user successfully!",
      metadata: await CartService.getCartOfUser(user),
    }).send(res);
  };
}

export default new CartController();
