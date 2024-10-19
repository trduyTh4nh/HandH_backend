import { SuccessResponse } from "../core/success.response";
import ProductService from "../service/product.service";
import {
  IColorProductVariation,
  IProduct,
  ISizeProductVarication,
  ITypeFilter,
} from "../types/type.all";
import { NextFunction, Request, Response } from "../types/type.express";

import env from "dotenv";
import { adminPlayer } from "../utils";
import { BadRequestError } from "../core/error.response";
env.config();

class ProductController {
  getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Get all products successfully!",
      metadata: await ProductService.getAllProduct(),
    }).send(res);
  };
  createAProduct = async (req: Request, res: Response, next: NextFunction) => {
    const product: IProduct = req.body.product;
    // const checkAdmin = await adminPlayer(req.headerData?.user?.role ?? "")
    // if (checkAdmin) {
    //     throw new BadRequestError("You do not have permission!")
    // }
    new SuccessResponse({
      message: "Create product successfully!",
      metadata: await ProductService.createProduct(product),
    }).send(res);
  };

  publicProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    // const checkAdmin = await adminPlayer(req.headerData?.user?.role ?? "")
    // if (checkAdmin) {
    //     throw new BadRequestError("You do not have permission!")
    // }

    new SuccessResponse({
      message: "Public product successfully!",
      metadata: await ProductService.publicProduct(id),
    }).send(res);
  };

  unPublicProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    // const checkAdmin = await adminPlayer(req.headerData?.user?.role ?? "")
    // if (checkAdmin) {
    //     throw new BadRequestError("You do not have permission!")
    // }

    new SuccessResponse({
      message: "Public product successfully!",
      metadata: await ProductService.unPublicProduct(id),
    }).send(res);
  };

  draftProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    new SuccessResponse({
      message: "Draft product successfully!",
      metadata: await ProductService.daftProduct(id),
    }).send(res);
  };

  undraftProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    new SuccessResponse({
      message: "UnDaftProduct product successfully!",
      metadata: await ProductService.unDaftProduct(id),
    }).send(res);
  };

  getProductPerPage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const page: number = parseInt(req.params.page);
    const quantityPerpage: number = 5;
    new SuccessResponse({
      message: `Get prouct of ${page} successfully!`,
      metadata: await ProductService.getProductsWithPage(page, quantityPerpage),
    }).send(res);
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const product: IProduct = req.body.product;
    new SuccessResponse({
      message: "Update product successfully!",
      metadata: await ProductService.updateProduct(product, id),
    }).send(res);
  };

  addSizeProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.body.idProduct;
    const size: ISizeProductVarication = req.body.dataSize;

    new SuccessResponse({
      message: "Add size product successfully!",
      metadata: await ProductService.addSizeProduct({ size, id }),
    }).send(res);
  };

  removeSizeProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const idPro: string = req.body.idProduct;
    const size: string = req.body.size;

    new SuccessResponse({
      message: "Remove size product successfully!",
      metadata: await ProductService.removeSizeProduct({ size, idPro }),
    }).send(res);
  };

  addColorProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.body.idProduct;
    const color_code = req.body.color_code;
    const color_price = req.body.color_price;
    const color_isPicked = req.body.color_isPicked;
    const file = req.files[0];

    const color: IColorProductVariation = {
      color_code: color_code,
      color_price: color_price,
      color_isPicked: color_isPicked,
      image_product_col: file,
    };

    new SuccessResponse({
      message: "Add color successfully!",
      metadata: await ProductService.addColorProduct({ color, id }),
    }).send(res);
  };

  removeColorProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const idPro: string = req.body.idProduct;
    const color: string = req.body.color;

    new SuccessResponse({
      message: "Remove product successfully!",
      metadata: await ProductService.removeColorProduct({ color, idPro }),
    }).send(res);
  };

  deleteProductForever = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    new SuccessResponse({
      message: "Deleted product successfully!",
      metadata: await ProductService.deleteProductForever(id),
    }).send(res);
  };

  searchProduct = async (req: Request, res: Response, next: NextFunction) => {
    const query: string | undefined = req.query.search as string;

    if (!query) {
      throw new BadRequestError("Search query is required!");
    }

    new SuccessResponse({
      message: "Result search",
      metadata: await ProductService.searchProduct(query),
    }).send(res);
  };

  updateImageForProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const idPro = req.params.id;
    const file = req.files[0];

    new SuccessResponse({
      message: "Update image for product successfully!",
      metadata: await ProductService.uploadImageForProduct(idPro, file),
    }).send(res);
  };

  searchFilterProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const dataFilter: ITypeFilter = req.body.filter;
    new SuccessResponse({
      message: "Result search!!",
      metadata: await ProductService.searchProductByFilterService(
        dataFilter,
        0,
        0
      ), // trước mắt là lọc chưa phân trang
    }).send(res);
  };

  getNProductLastest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const number = req.params.num;

    new SuccessResponse({
      message: `Get ${number} latest product successfully!`,
      metadata: await ProductService.getNProductLastest(number),
    }).send(res);
  };

  addImageForProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const idPro = req.params.id;
    const file = req.files[0];

    new SuccessResponse({
      message: "add image description for prouct successfully!",
      metadata: await ProductService.addImageForProduct(file, idPro),
    }).send(res);
  };
}

export default new ProductController();
