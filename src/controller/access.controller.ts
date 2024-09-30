import { NextFunction, Request, Response } from "../types/type.express";
import { CREATED, SuccessResponse } from "../core/success.response";
import AccessService from "../service/access.service";
import { IKeyTokenModel, IUser, IUserData } from "../types/type.all";
import { send } from "process";

class AccessController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    const userData: IUserData = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      birthDay: req.body.birthDay,
      phone: req.body.phone,
      userAddress: req.body.userAddress,
    };
    new CREATED({
      message: "Signup successfully!",
      metadata: (await AccessService.register(userData)) || {},
    }).send(res);
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    const result = await AccessService.login(email, password, "");
    // setup cookie token
    // res.cookie("token", result.tokens, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
    // });

    new SuccessResponse({
      message: "Login successfully!",
      metadata: result || {},
    }).send(res);
  };
  logout = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.headerData?.keyStore;

    new SuccessResponse({
      message: "Logout successfully!",
      metadata: await AccessService.logout(key?._id),
    }).send(res);
  };

  handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const refreshToken: string = req.headerData?.keyStore?.refreshToken ?? "";
    const keyStore: IKeyTokenModel =
      req.headerData?.keyStore || ({} as IKeyTokenModel);
    const user: IUser = req.headerData?.user || ({} as IUser);

    new SuccessResponse({
      message: "Get token success!",
      metadata: await AccessService.handleRefreshTokenV2(
        keyStore,
        user,
        refreshToken
      ),
    }).send(res);
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const user: IUser = req.headerData?.user || ({} as IUser);
    const newPass: string = req.body.newPass;
    const currentPass: string = req.body.currentPass;
    const confirmPass: string = req.body.confirmPass;
    new SuccessResponse({
      message: "Change password successfully!",
      metadata: await AccessService.changePassword(
        user.email,
        currentPass,
        newPass,
        confirmPass
      ),
    }).send(res);
  };

  updateUserInformation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userInfo = req.body.user;
    const idUser = req.params.id;
    new SuccessResponse({
      message: "Update user information successfully!",
      metadata: await AccessService.updateInfomationUser(userInfo, idUser),
    }).send(res);
  };

  updateAvatarForUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const idUser = req.params.id;
    const file = req.files[0];

    new SuccessResponse({
      message: "Update avatar for user successfully!",
      metadata: await AccessService.updateImageForUser(idUser, file),
    }).send(res);
  };
}

export default new AccessController();
