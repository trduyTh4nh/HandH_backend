import { SuccessResponse } from "../core/success.response";
import ProductService from "../service/product.service";
import { IProduct } from "../types/type.all";
import { NextFunction, Request, Response } from "../types/type.express";

import env from 'dotenv'
import { adminPlayer } from "../utils";
import { BadRequestError } from "../core/error.response";
env.config()

class ProductController {
    getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Get all products successfully!",
            metadata: await ProductService.getAllProduct()
        }).send(res)
    }
    createAProduct = async (req: Request, res: Response, next: NextFunction) => {
        const product: IProduct = req.body.product
        const checkAdmin = await adminPlayer(req.headerData?.user?.role ?? "")
        if(checkAdmin){
            throw new BadRequestError("You do not have permission!")
        }
        new SuccessResponse({
            message: "Create product successfully!",
            metadata: await ProductService.createProduct(product)
        }).send(res)
    }
}

export default new ProductController()