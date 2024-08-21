import { SuccessResponse } from "../core/success.response";
import ProductService from "../service/product.service";
import { NextFunction, Request, Response } from "../types/type.express";


class ProductController {
    getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Get all products successfully!",
            metadata: await ProductService.getAllProduct()
        }).send(res)
    }

}

export default new ProductController()