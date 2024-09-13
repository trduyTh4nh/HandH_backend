import { SuccessResponse } from "../core/success.response";
import ProductService from "../service/product.service";
import { IColorProductVariation, IProduct, ISizeProductVarication } from "../types/type.all";
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
        // const checkAdmin = await adminPlayer(req.headerData?.user?.role ?? "")
        // if (checkAdmin) {
        //     throw new BadRequestError("You do not have permission!")
        // }
        new SuccessResponse({
            message: "Create product successfully!",
            metadata: await ProductService.createProduct(product)
        }).send(res)
    }

    publicProduct = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id
        // const checkAdmin = await adminPlayer(req.headerData?.user?.role ?? "")
        // if (checkAdmin) {
        //     throw new BadRequestError("You do not have permission!")
        // }

        new SuccessResponse({
            message: "Public product successfully!",
            metadata: await ProductService.publicProduct(id)
        }).send(res)
    }

    unPublicProduct = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id
        // const checkAdmin = await adminPlayer(req.headerData?.user?.role ?? "")
        // if (checkAdmin) {
        //     throw new BadRequestError("You do not have permission!")
        // }

        new SuccessResponse({
            message: "Public product successfully!",
            metadata: await ProductService.unPublicProduct(id)
        }).send(res)
    }

    draftProduct = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id
        new SuccessResponse({
            message: "Draft product successfully!",
            metadata: await ProductService.daftProduct(id)
        }).send(res)
    }

    undraftProduct = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id
        new SuccessResponse({
            message: "UnDaftProduct product successfully!",
            metadata: await ProductService.unDaftProduct(id)
        }).send(res)
    }

    getProductPerPage = async (req: Request, res: Response, next: NextFunction) => {
        const page: number = parseInt(req.params.page)

        new SuccessResponse({
            message: `Get prouct of ${page} successfully!`,
            metadata: await ProductService.getProductsWithPage(page)
        }).send(res)
    }

    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id
        const product: IProduct = req.body.product
        new SuccessResponse({
            message: "Update product successfully!",
            metadata: await ProductService.updateProduct(product, id)
        }).send(res)
    }

    addSizeProduct = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.body.idProduct
        const size: ISizeProductVarication = req.body.dataSize

        new SuccessResponse({
            message: "Add size product successfully!",
            metadata: await ProductService.addSizeProduct({ size, id })
        }).send(res)
    }

    removeSizeProduct = async (req: Request, res: Response, next: NextFunction) => {
        const idPro: string = req.body.idProduct
        const size: string = req.body.size

        new SuccessResponse({
            message: "Remove size product successfully!",
            metadata: await ProductService.removeSizeProduct({ size, idPro })
        }).send(res)
    }


    addColorProduct = async (req: Request, res: Response, next: NextFunction) => {

        const id: string = req.body.idProduct
        const color: IColorProductVariation = req.body.dataColor

        new SuccessResponse({
            message: "Add color successfully!",
            metadata: await ProductService.addColorProduct({ color, id })
        }).send(res)
    }

    removeColorProduct = async (req: Request, res: Response, next: NextFunction) => {
        const idPro: string = req.body.idProduct
        const color: string = req.body.color

        new SuccessResponse({
            message: "Remove product successfully!",
            metadata: await ProductService.removeColorProduct({ color, idPro })
        }).send(res)
    }

    deleteProductForever = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id
        new SuccessResponse({
            message: "Deleted product successfully!",
            metadata: await ProductService.deleteProductForever(id)
        }).send(res)
    }


}

export default new ProductController()