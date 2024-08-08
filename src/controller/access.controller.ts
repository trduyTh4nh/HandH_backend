import { NextFunction, Request, Response } from "express";
import { CREATED } from "../core/success.response";
import AccessService from "../service/access.service";
import { IUser } from "../types/type.all";


class AccessController {
    register = async (req: Request, res: Response, next: NextFunction) => {

        const userData: IUser = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            birthDay: req.body.birthDay,
            phone: req.body.phone,
            userAddress: req.body.userAddress
        }

        new CREATED({
            message: "Signup successfully!",
            metadata: await AccessService.register(userData) || {}
        }).send(res)
    }
}

export default new AccessController()