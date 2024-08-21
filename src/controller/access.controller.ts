import { NextFunction, Request, Response } from "../types/type.express";
import { CREATED, SuccessResponse } from "../core/success.response";
import AccessService from "../service/access.service";
import { IUser, IUserData } from "../types/type.all";



class AccessController {
    register = async (req: Request, res: Response, next: NextFunction) => {
        const userData: IUserData = {
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

    login = async (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email;
        const password = req.body.password

        new SuccessResponse({
            message: "Login successfully!",
            metadata: await AccessService.login(email, password, "") || {}
        }).send(res)
    }
}

export default new AccessController()