import { BadRequestError } from "../core/error.response";
import {
  addProducIntoWishListFunc,
  getAllProductInWistList,
  removeProducFromWishListFunc,
} from "../models/repos/wishlist.repo";

class WishListService {
  static async addProductToWishList(
    idProduct: string,
    idUser: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (!idProduct) {
      throw new BadRequestError("Missing product!");
    }
    if (!idUser) {
      throw new BadRequestError("Missing user!");
    }
    return await addProducIntoWishListFunc(idProduct, idUser);
  }

  static async removeProductFromWishList(
    idProduct: string,
    idUser: string
  ): Promise<any> {
    if (!idProduct) {
      throw new BadRequestError("Missing product!");
    }
    if (!idUser) {
      throw new BadRequestError("Missing user!");
    }

    return removeProducFromWishListFunc(idProduct, idUser);
  }

  static async getAllProductInWishList(idUser: string): Promise<any> {
    if (!idUser) {
      throw new BadRequestError("Missing user!");
    }
    return await getAllProductInWistList(idUser);
  }
}

export default WishListService;
