import JWT, { JwtPayload } from "jsonwebtoken";
import { errorWriteDown } from "../utils";
import { asyncHandler } from "../helper/asyncHandler";
import { NextFunction, Request, Response } from "../types/type.express";
import {
  AuthFailureError,
  BadRequestError,
  NotFoundError,
} from "../core/error.response";
import KeyTokenService from "../service/keytoken.service";
import { IUser } from "../types/type.all";
import env from "dotenv";
import { findUserByEmail_ } from "../models/repos/user.repo";
env.config();

const HEADER = {
  APIKEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESHTOKEN: "x-rtoken-id",
  AUTH: "test",
};

const createTokenPair = async (
  payload: any,
  privateKey: string,
  publicKey: string
): Promise<any> => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    //NOTE: 315
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("error verify:: ", err);
      } else {
        console.log("decode verify:: ", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    const _err: string = errorWriteDown(error);
    throw new Error(_err);
  }
};

const authentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.headerData) {
      req.headerData = {};
    }
    // 1 kiểm tra idUser id có missing hay không
    const userId = req.headers[HEADER.CLIENT_ID.toLowerCase()] as
      | string
      | undefined;

    if (!userId) {
      throw new AuthFailureError("Invalid request!");
    }
    // 2 tìm và kiểm tra keystore của user
    const keyStore = await KeyTokenService.findUserByIdUser(userId);
    if (!keyStore) {
      throw new NotFoundError("Not found key store");
    }

    if (req.headers[HEADER.REFRESHTOKEN]) {
      try {
        // dùng refresh token để decode private key
        const refreshtoken = req.headers[HEADER.REFRESHTOKEN];

        if (typeof refreshtoken !== "string") {
          throw new BadRequestError("Error typeof data!");
        }

        const decodeUser: any = JWT.verify(refreshtoken, keyStore.privateKey);
        console.log("DEBUG DECODE ID USER: ", decodeUser.user);
        if (userId !== decodeUser.user) {
          throw new AuthFailureError("Invalid Iduser");
        }

        req.headerData!.user = decodeUser;
        req.headerData!.keyStore = keyStore;
        req.headerData!.keyStore.refreshToken = refreshtoken;

        return next();
      } catch (error) {
        throw error;
      }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION] as string | undefined;

    if (!accessToken) throw new AuthFailureError("Invalid request");

    try {
      const decodeUser: any = JWT.verify(accessToken, keyStore.publicKey);
      if (userId !== decodeUser.user) {
        throw new AuthFailureError("Invalid userID");
      }
      req.headerData.keyStore = keyStore;

      req.headerData.user = decodeUser;

      // req.headerData.keyStore = keyStore;
      // const _idUser: string = decodeUser.user
      // const foundUser: any = await findUserById(_idUser)
      // req.headerData.user = foundUser;

      return next();
    } catch (error) {
      throw error;
    }
  }
);

const checkRoleAd = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const email: string = req.headerData?.user?.email!;
    const findUser: IUser | null = await findUserByEmail_(email);

    // console.log("user role: ", findUser?.role)
    // console.log("admin role", process.env.ROLEADMIN)
    if (findUser?.role![0] !== process.env.ROLEADMIN) {
      throw new AuthFailureError("You does not have permission!");
    } else {
      next();
    }
  }
);

export { createTokenPair, authentication, checkRoleAd };
