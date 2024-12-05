import { SuccessResponse } from "../core/success.response";
import WishListService from "../service/wishlist.service";
import { IUser } from "../types/type.all";
import { NextFunction, Request, Response } from "../types/type.express";

class WishListController {
  addProductToWishList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user: any = req.headerData?.user || ({} as IUser);
    const productId = req.body.productId;
    console.log("Product id: ", productId);
    console.log("header: ", user);
    new SuccessResponse({
      message: "Add product into wishlist successfully!",
      metadata: await WishListService.addProductToWishList(
        productId,
        user.user
      ),
    }).send(res);
  };

  removeProductInWishlish = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user: any = req.headerData?.user || ({} as IUser);
    const productId = req.params.productId;

    new SuccessResponse({
      message: "Remove product from wishlist successfully!",
      metadata: await WishListService.removeProductFromWishList(
        productId,
        user.user
      ),
    }).send(res);
  };

  getAllProductInWishList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user: any = req.headerData?.user || ({} as IUser);
    new SuccessResponse({
      message: "Get all product in wishlist successfully!",
      metadata: await WishListService.getAllProductInWishList(user.user),
    }).send(res);
  };
}

export default new WishListController();
