import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../core/error.response";
import {
  findUserByEmail,
  findUserByEmail_,
  findUserById,
  updateAvatarForUser,
  updateInfoUser,
} from "../models/repos/user.repo";
import User from "../models/user.model";
import { IKeyTokenModel, IUser, IUserData } from "../types/type.all";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { errorWriteDown, getInfoData, verifyJWT } from "../utils";
import env from "dotenv";
import KeyTokenService from "./keytoken.service";
import mongoose from "mongoose";
import { createTokenPair } from "../auth/auth";
env.config();

class AccessService {
  static async register(payload: IUserData): Promise<any> {
    const roleUser: string | undefined = process.env.ROLEUSER;
    const { email, password, name, birthDay, phone, userAddress } = payload;

    const foudnUser = await findUserByEmail(email);
    if (foudnUser) {
      throw new BadRequestError("User already exists!");
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        email: email,
        password: hashedPassword,
        name: name,
        birthDay: birthDay,
        phone: phone,
        userAddress: userAddress,
        role: roleUser,
      });
      // // Access the _id field
      // console.log('User ID:', user._id);

      if (user) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        console.log({ privateKey, publicKey });

        const idUser = new mongoose.Types.ObjectId(user._id + "");

        const keyData: IKeyTokenModel = {
          user: idUser,
          publicKey: publicKey,
          privateKey: privateKey,
        };

        const keyStore = await KeyTokenService.createToken(keyData);

        if (!keyStore) {
          return {
            code: "102",
            message: "ketStore error!",
          };
        }
        const tokens = await createTokenPair(
          { userId: user._id, email },
          privateKey,
          publicKey
        );
        console.log(`Create token success::`, tokens);

        const result: any = {
          email: user.email,
          name: name,
          birthDay: birthDay,
          userAddress: userAddress,
          phone: phone,
        };

        return {
          code: 201,
          metadata: {
            user: result,
            tokens: tokens,
          },
        };
      } else {
        throw new BadRequestError("Can not create user!", 400);
      }
    } catch (error) {
      var _error: string = errorWriteDown(error);
      throw new BadRequestError(_error);
    }
  }

  static async login(
    email: string,
    password: string,
    refreshToken: string
  ): Promise<any> {
    const foudnUser = await findUserByEmail_(email);
    if (!foudnUser) {
      throw new BadRequestError("User not register!");
    }

    const match: boolean = await bcrypt.compare(password, foudnUser.password);

    if (!match) {
      throw new AuthFailureError(
        "Authentication error, Incorrect your password!"
      );
    }

    const privateKey: string = crypto.randomBytes(64).toString("hex");
    const publicKey: string = crypto.randomBytes(63).toString("hex");

    const idUser: any = foudnUser._id;

    console.log("User id: ", idUser);
    const tokens: IKeyTokenModel = await createTokenPair(
      { user: idUser, email: email },
      privateKey,
      publicKey
    );

    await KeyTokenService.createToken({
      refreshToken: tokens.refreshToken,
      privateKey: privateKey,
      publicKey: publicKey,
      user: idUser,
    });

    const fieldUser: string[] = ["_id", "email", "name", "userAddress"];

    return {
      user: getInfoData({ fields: fieldUser, object: foudnUser }),
      tokens: tokens,
    };
  }

  static async logout(keyStoreId: any): Promise<any> {
    const deleteKeyStore = await KeyTokenService.removeKeyById(keyStoreId);
    console.log({ deleteKeyStore });
    return deleteKeyStore;
  }

  // kiểm tra token nào đã được sử dụng, nếu user đã được refresh một token mới r thì nó sẽ lưu token
  // đã hết hạn hoặc đã bỏ đi vào Array refresh token used nếu mà token đã bỏ đi mà được sử dụng lại thì
  // chắc chắn có điều bất thường xảy ra đối với user đó và sẽ "ban" nó ngay và luôn
  static async handleRefreshToken(refreshToken: string) {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // nếu tìm thấy token đã được sử dụng thì phát hiện có vấn đề với token này vì nó đã được sử dụng và lưu trong array refreshTokenUsed trước đó
    if (foundToken) {
      // decode xem user sở hữu token đã qua sử dụng là ai
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      await KeyTokenService.deleteKeyById(userId);

      throw new ForbiddenError("Something wrong happen!! Please login again!");
    }

    // nếu không tìm thấy thì OK hợp lệ
    //và sau đó tìm kiếm thử xem đúng là nó có đang được sử dụng trong database không?
    // nếu có thì ok còn nếu không trả lỗi authentication

    const holderToken = await KeyTokenService.findTokenByRefreshToken(
      refreshToken
    );
    if (!holderToken) {
      throw new AuthFailureError("User not registed!");
    }
    // nếu tìm được thì verify cái token đó
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    // kiểm tra id user 1 lần nữa
    const foundUser = await findUserByEmail(email);
    if (!foundUser) {
      throw new AuthFailureError("User not registed!");
    }

    // nếu tìm được thì tạo 1 cặp token mới và trả về cho user
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.privateKey,
      holderToken.publicKey
    );

    try {
      console.log("Attempting to update token...");
      // update cặp token mới vào database
      await holderToken.updateOne({
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokenUsed: refreshToken,
        },
      });

      return {
        user: {
          userId,
          email,
        },
        tokens,
      };
    } catch (error) {
      var er: string = errorWriteDown(error);
      throw new Error(er);
    }
  }

  static async handleRefreshTokenV2(
    keyStore: IKeyTokenModel,
    user: IUser,
    refreshToken: string
  ) {
    const { email } = user;
    const userId = user._id;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happen!! Please login again!");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("User not registed!");
    }

    const foundUser = await findUserByEmail(email);
    if (!foundUser) {
      throw new AuthFailureError("User not registed!");
    }

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.privateKey,
      keyStore.publicKey
    );

    try {
      console.log("Attempting to update token...");
      const tokenFound = await KeyTokenService.findKeyStoreById(keyStore._id);
      // update cặp token mới vào database
      await tokenFound.updateOne({
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokenUsed: refreshToken,
        },
      });

      return {
        user: {
          userId,
          email,
        },
        tokens,
      };
    } catch (error) {
      var er: string = errorWriteDown(error);
      throw new Error(er);
    }
  }

  static async changePassword(
    email: string,
    currentPass: string,
    newPass: string,
    confirmPass: string
  ) {
    if (!currentPass || !newPass || !confirmPass) {
      throw new BadRequestError("Need to provide enough information!");
    }
    if (newPass !== confirmPass) {
      throw new BadRequestError(
        "New password and confirm password do not match"
      );
    }

    try {
      const foundUser = await findUserByEmail(email);
      if (!foundUser) {
        throw new NotFoundError("Not found user!");
      }
      const match = await bcrypt.compare(currentPass, foundUser.password);
      if (!match) {
        throw new BadRequestError("Current password is incorrect");
      }

      const hashedNewPassword = await bcrypt.hash(newPass, 10);

      foundUser.password = hashedNewPassword;

      return await foundUser.save();
    } catch (error) {
      const er: string = errorWriteDown(error);
      throw new BadRequestError(er);
    }
  }

  static async updateInfomationUser(user: IUser, userId: string): Promise<any> {
    if (userId) {
      const foundUser = await findUserById(userId);

      if (!foundUser) {
        throw new BadRequestError("Nout found user to update!");
      }

      return await updateInfoUser(user, userId);
    } else {
      throw new BadRequestError("Not found user to update!");
    }
  }

  static async updateImageForUser(idUser: string, image: any): Promise<any> {
    return await updateAvatarForUser(idUser, image);
  }
}

export default AccessService;
