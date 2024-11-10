import { BadRequestError } from "../../core/error.response";
import { IProduct } from "../../types/type.all";
import { _idConverted } from "../../utils";
import ProductModel from "../product.model";
import WishListModel from "../wishlist.model";
import { findUserById } from "./user.repo";

const addProducIntoWishListFunc = async (
  idProduct: string,
  idUser: string
): Promise<any> => {
  const foundProduct = await ProductModel.findOne({
    _id: _idConverted(idProduct),
  });

  if (!foundProduct) {
    throw new BadRequestError("Not found product!");
  }

  const checkWishList = await WishListModel.findOne({
    userId: idUser,
  });

  if (!checkWishList) {
    return await WishListModel.create({
      userId: idUser,
      products: [foundProduct],
    });
  } else {
    const productExists = checkWishList.products.some(
      (product) => product._id?.toString() === foundProduct._id.toString()
    );

    if (productExists) {
      throw new BadRequestError("Product already in wishlist!");
    }

    checkWishList.products.push(foundProduct);
    return await checkWishList.save();
  }
};

// const addProducIntoWishListFunc = async (
//   idProduct: string,
//   idUser: string
// ): Promise<any> => {
//   const foundProduct = await ProductModel.findOne({
//     _id: _idConverted(idProduct),
//   });

//   if (!foundProduct) {
//     throw new BadRequestError("Not found product!");
//   }

//   const wishlistUpdate = await WishListModel.updateOne(
//     {
//       userId: idUser,
//       "products.product_slug": { $ne: foundProduct.product_slug },
//     },
//     {
//       $push: {
//         products: {
//           product_slug: foundProduct.product_slug,
//           ...foundProduct.toObject(),
//         },
//       },
//     },
//     { upsert: true }
//   );

//   if (
//     wishlistUpdate.modifiedCount === 0 &&
//     wishlistUpdate.upsertedCount === 0
//   ) {
//     throw new BadRequestError("Product already in wishlist!");
//   }

//   return wishlistUpdate;
// };

const removeProducFromWishListFunc = async (
  idProduct: string,
  idUser: string
): Promise<any> => {
  const foundProduct = await ProductModel.findOne({
    _id: _idConverted(idProduct),
  });

  if (!foundProduct) {
    throw new BadRequestError("Not found product!");
  }

  const checkWishList = await WishListModel.findOne({
    userId: idUser,
  });

  if (!checkWishList) {
    throw new BadRequestError("Not found wish list!");
  } else {
    const productExists = checkWishList.products.some(
      (product) => product._id?.toString() === foundProduct._id.toString()
    );

    if (!productExists) {
      throw new BadRequestError("Not found product in wishlist!");
    }

    checkWishList.products = checkWishList.products.filter(
      (product) => product._id?.toString() !== foundProduct._id.toString()
    );

    return await checkWishList.save();
  }
};

const getAllProductInWistList = async (idUser: string): Promise<any> => {
  const foundUser = await findUserById(idUser);
  if (!foundUser) {
    throw new BadRequestError("Not found User!");
  }
  return await WishListModel.find({
    userId: idUser,
  });
};

export {
  addProducIntoWishListFunc,
  removeProducFromWishListFunc,
  getAllProductInWistList,
};
