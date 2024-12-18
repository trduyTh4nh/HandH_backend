import { forEach } from "lodash";
import { bucket } from "../../configs/storage";
import { BadRequestError } from "../../core/error.response";
import {
  IColorProductVariation,
  IProduct,
  ISizeProductVarication,
  ITypeFilter,
} from "../../types/type.all";
import { _idConverted, uploadImage } from "../../utils";
import ProductModel from "../product.model";
import Category from "../category.model";

const getAllProducts = async (): Promise<IProduct[] | null> => {
  const products = await ProductModel.find({});
  return products;
};

const crearteProductFunc = async (product: IProduct): Promise<IProduct> => {
  return await ProductModel.create(product);
};

const getProductById = async (idPro: string) => {
  const _id = _idConverted(idPro);

  return await ProductModel.findOne({ _id });
};

const publicProductFunc = async (idProduct: string) => {
  const _id = _idConverted(idProduct);

  const product: IProduct | undefined = await findProductById(idProduct);

  // product.isDraft

  return await ProductModel.findOneAndUpdate(
    { _id },
    {
      $set: {
        isPublished: true,
      },
    },
    {}
  );
};

const unPublicProductFunc = async (idProduct: string) => {
  const _id = _idConverted(idProduct);

  return await ProductModel.findOneAndUpdate(
    { _id },
    {
      $set: {
        isPublished: false,
      },
    },
    {}
  );
};

const draftProductFunc = async (idProduct: string) => {
  const _id = _idConverted(idProduct);

  return await ProductModel.findOneAndUpdate(
    { _id },
    {
      $set: {
        isDraft: true,
      },
    }
  );
};

const unDraftProductFunc = async (idProduct: string) => {
  const _id = _idConverted(idProduct);

  return await ProductModel.findByIdAndUpdate(
    { _id },
    {
      $set: {
        isDraft: false,
      },
    }
  );
};

const getPageProducts = async (page: number, quantityPerpage: number) => {
  const quantityProducerPerPage = quantityPerpage;
  const resutPage = await ProductModel.find({ isPublished: true })
    .limit(quantityProducerPerPage)
    .skip(quantityProducerPerPage * (page - 1));
  return resutPage;
};

const updateProductFunc = async (
  product: IProduct,
  id: string
): Promise<any> => {
  const foundProduct = await findProductById(id);
  console.log("DEUBG PRODUCT: ", foundProduct);
  if (!foundProduct) {
    throw new BadRequestError("Not found product to update!");
  }
  const {
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_slug,
    product_stock,
  } = product;

  const updateData: Partial<IProduct> = {};

  if (product_name) updateData.product_name = product_name;
  if (product_thumb) updateData.product_thumb = product_thumb;
  if (product_description) updateData.product_description = product_description;
  if (product_price) updateData.product_price = product_price;
  if (product_slug) updateData.product_slug = product_slug;
  if (product_stock) updateData.product_stock = product_stock;

  if (Object.keys(updateData).length > 0) {
    const updateProduct = await ProductModel.findByIdAndUpdate(
      _idConverted(id),
      updateData,
      { new: true }
    );
    return updateProduct;
  } else {
    throw new BadRequestError("No data to update!");
  }
};

const addSizeProductFunc = async (
  size: ISizeProductVarication,
  idProduct: string
): Promise<any> => {
  const _id = _idConverted(idProduct);
  const findProductUpdate = await ProductModel.findOne({
    _id,
  });

  if (!findProductUpdate) {
    throw new BadRequestError("Not found product to update!");
  }
  // có thể dùng some cho đỡ nhằn
  const arrSizeProduct: ISizeProductVarication[] =
    findProductUpdate.product_sizes;
  const arrSize = arrSizeProduct.map((item) => item.size_name);

  if (arrSize.includes(size.size_name)) {
    throw new BadRequestError("This size already exist!");
  }

  findProductUpdate.product_sizes.push(size);

  const updatedProduct = await findProductUpdate.save();

  return {
    id: updatedProduct._id,
    productSizes: updatedProduct.product_sizes,
  };
};

const removeSizeProductFunc = async (
  size: string,
  idProduct: string
): Promise<any> => {
  const _id = _idConverted(idProduct);
  const findProductUpdate = await ProductModel.findOne({
    _id,
  });

  if (!findProductUpdate) {
    throw new BadRequestError("Not found product to update!");
  }

  findProductUpdate.product_sizes = findProductUpdate.product_sizes.filter(
    (itemSize) => itemSize.size_name !== size
  );

  const updatedProduct = await findProductUpdate.save();

  return {
    id: updatedProduct._id,
    productSizes: updatedProduct.product_sizes,
  };
};

const addColorProductFunc = async (
  color: IColorProductVariation,
  idProduct: string
): Promise<any> => {
  const _id = _idConverted(idProduct);
  const findProductUpdate = await ProductModel.findOne({
    _id,
  });

  if (!findProductUpdate) {
    throw new BadRequestError("Not found product to update!");
  }

  const arrColorProduct: IColorProductVariation[] =
    findProductUpdate.product_colors;
  const arrColor = arrColorProduct.map((item) => item.color_code);
  if (arrColor.includes(color.color_code)) {
    throw new BadRequestError("The code already exist!");
  }

  const result: any = await uploadImage(color.image_product_col);

  color["image_product_col"] = result.publicUrl;

  findProductUpdate.product_colors.push(color);

  const updatedProduct = await findProductUpdate.save();

  return {
    id: updatedProduct._id,
    productColors: updatedProduct.product_colors,
  };
};

const removeColorProductFunc = async (
  color: string,
  idProduct: string
): Promise<any> => {
  const _id = _idConverted(idProduct);
  const findProductUpdate = await ProductModel.findOne({
    _id,
  });
  if (!findProductUpdate) {
    throw new BadRequestError("Not found product to update!");
  }
  findProductUpdate.product_colors = findProductUpdate.product_colors.filter(
    (item) => item.color_code !== color
  );
  const updatedProduct = await findProductUpdate.save();
  return {
    id: updatedProduct._id,
    productColors: updatedProduct.product_colors,
  };
};

const deleteProductFunc = async (idProduct: string): Promise<any> => {
  const _id = _idConverted(idProduct);
  const findProductUpdate = await ProductModel.findOne({
    _id,
  });
  if (!findProductUpdate) {
    throw new BadRequestError("Not found product to update!");
  }

  if (findProductUpdate.isDraft === false) {
    throw new BadRequestError(
      "This product is not a draft, if you want to remove it you must update it to a draft!"
    );
  }

  return await ProductModel.deleteOne({ _id: _id });
};

const findProductById = async (idProduct: string): Promise<any> => {
  return await ProductModel.findOne({
    _id: _idConverted(idProduct),
  });
};

const searchProductFunc = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  const regex = new RegExp(query, "i");

  const result = await ProductModel.find({
    product_name: { $regex: regex },
    isPublished: true,
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  return result;
};

const updateImageForProductFunc = async (idPro: string, image: any) => {
  const findProductToUpdate: IProduct = await findProductById(idPro);

  if (!findProductToUpdate) {
    throw new BadRequestError("Not found product to update!");
  }

  if (!image) {
    throw new BadRequestError("Not found image to update!");
  }

  const fileName = findProductToUpdate.product_thumb?.split("/").pop();
  console.log("DEBUG file name: ", fileName);
  const file = bucket.file(fileName);

  if (file) {
    await file
      .delete()
      .then(() => {
        console.log(`File ${fileName} deleted successfully.`);
      })
      .catch((error: any) => {
        console.error("Error deleting file from Firebase Storage:", error);
      });
  }

  const result: any = await uploadImage(image);
  findProductToUpdate.product_thumb = result.publicUrl;
  return await findProductToUpdate.save();
};

const searchProductByFilterFunc = async (
  filter: ITypeFilter,
  skip: number,
  take: number
): Promise<any> => {
  const {
    latestProduct,
    pricesFilter,
    maximumPrice,
    minimumPrice,
    isSortByPrice,
    sizesFilter,
    colorsFilter,
  } = filter;

  const query: any = {};

  // lọc theo giá tối đa và giá tối thiểu
  console.log(maximumPrice);
  console.log(minimumPrice);
  if (minimumPrice !== undefined && maximumPrice !== undefined) {
    query.product_price = { ...query.product_price, $gte: minimumPrice };
    query.product_price = { ...query.product_price, $lte: maximumPrice };
  }

  // Lọc theo size

  if (sizesFilter && sizesFilter.length > 0) {
    query["product_sizes.size_name"] = { $in: sizesFilter };
  }

  // Lọc theo màu sắc

  if (colorsFilter && colorsFilter.length > 0) {
    query["product_colors.color_code"] = { $in: colorsFilter };
  }

  let filterProductQuery = ProductModel.find({ ...query, isPublished: true });

  // xếp theo sản phẩm mới nhất
  if (latestProduct) {
    filterProductQuery = filterProductQuery.sort({ createAt: -1 });
  }

  // Sắp xếp theo giá
  if (isSortByPrice !== undefined) {
    filterProductQuery = filterProductQuery.sort({
      product_price: isSortByPrice ? 1 : -1,
    });
  }
  // if (isSortByPrice) {
  //   filterProductQuery = filterProductQuery.sort({ product_price: 1 });
  // } else {
  //   filterProductQuery = filterProductQuery.sort({ product_price: -1 });
  // }

  // Lọc theo giá cụ thể

  if (pricesFilter) {
    if (pricesFilter.isUp) {
      filterProductQuery = filterProductQuery
        .where("product_price")
        .gte(pricesFilter.price);
    } else {
      filterProductQuery = filterProductQuery
        .where("product_price")
        .lte(pricesFilter.price);
    }
  }

  // thiếu phân trang

  filterProductQuery = filterProductQuery.skip(skip).limit(take);

  const filterProduct = await filterProductQuery.exec();
  return {
    filterProduct: filterProduct,
    skip: skip,
    take: take,
  };
};

const getProductWithPageFunc = async (skip: number, take: number) => {
  const product = await ProductModel.find({ isPublished: true })
    .skip(skip)
    .limit(take);
  return product;
};

const getNProductLastestFunc = async (n: number) => {
  const result = await ProductModel.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(n);
  console.log("result: ", result);
  return result;
};

const addImageForProductFunc = async (file: any, idProduct: string) => {
  const product = await ProductModel.findOne({ _id: idProduct });
  if (!product) {
    throw new BadRequestError("Not found product!");
  }
  const result = await uploadImage(file);
  product.product_images.push(result.publicUrl);
  return await product.save();
};

const getProductFromCateFunc = async (idCate: string) => {
  // const findCategory = await Category.findOne({ _id: idCate });

  // if (!findCategory) {
  //   throw new BadRequestError("Not found this categories!");
  // }

  const result = await ProductModel.find({
    product_category: idCate,
    isPublished: true,
  });
  return result;
};

const updateQuantityStockProductFunc = async (
  quantity: number,
  idProduct: string
) => {
  const updatedProduct = await ProductModel.findOneAndUpdate(
    {
      _id: idProduct,
      product_stock: { $gte: -quantity },
    },
    { $inc: { product_stock: quantity } },
    { new: true }
  );

  if (!updatedProduct) {
    throw new BadRequestError(
      "Not found product to update stock or insufficient stock!"
    );
  }

  return updatedProduct;
};

export {
  getAllProducts,
  crearteProductFunc,
  getProductById,
  publicProductFunc,
  unPublicProductFunc,
  draftProductFunc,
  unDraftProductFunc,
  getPageProducts,
  updateProductFunc,
  addSizeProductFunc,
  removeSizeProductFunc,
  addColorProductFunc,
  removeColorProductFunc,
  deleteProductFunc,
  findProductById,
  searchProductFunc,
  updateImageForProductFunc,
  searchProductByFilterFunc,
  getNProductLastestFunc,
  addImageForProductFunc,
  getProductFromCateFunc,
  getProductWithPageFunc,
  updateQuantityStockProductFunc,
};
