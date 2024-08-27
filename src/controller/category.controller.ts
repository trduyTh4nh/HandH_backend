import { BadRequestError } from "../core/error.response";
import { SuccessResponse } from "../core/success.response";
import { findUserById } from "../models/repos/user.repo";
import CategoryService from "../service/category.service";
import { ICategory, IUser } from "../types/type.all";
import { NextFunction, Request, Response } from "../types/type.express";
import { adminPlayer } from "../utils";


class CategoryController {
    createCategory = async (req: Request, res: Response, next: NextFunction) => {
        const cateogry: ICategory = req.body.category
        const _idUser: any = req.headerData?.user
        const foundUser: any = await findUserById(_idUser.user)
        const checkAdmin = await adminPlayer(foundUser.role[0] ?? "")
        if (!checkAdmin) {
            throw new BadRequestError("You do not have permission!")
        }
        new SuccessResponse({
            message: "Create category successfully!",
            metadata: await CategoryService.createCategory(cateogry)
        }).send(res)
    }

    getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Get category successfully!",
            metadata: await CategoryService.getAllCategory()
        }).send(res)
    }

    getACategory = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id
        new SuccessResponse({
            message: "Get a category successfully!",
            metadata: await CategoryService.getACategory(id)
        }).send(res)
    }

    deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id
        new SuccessResponse({
            message: "Delete category successfully!",
            metadata: await CategoryService.deleteCategory(id)
        }).send(res)
    }

    updateCategory = async (req: Request, res: Response, next: NextFunction) => {
        const entryData: ICategory = req.body.dataUpdate
        const id: string = req.params.id
        new SuccessResponse({
            message: "Update category successfully!",
            metadata: await CategoryService.updateCategory(entryData, id)
        }).send(res)
    }


}

export default new CategoryController()