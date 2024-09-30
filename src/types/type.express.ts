import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from "express";
import { IKeyTokenModel, IUser, IUserAddress } from "./type.all";

interface CustomHeaderData {
  user?: IUser;
  keyStore?: IKeyTokenModel;
  file?: any;
}

export type Request =
  | (ExpressRequest & { headerData?: CustomHeaderData })
  | any;
export type Response = ExpressResponse & { headerData?: CustomHeaderData };
export type NextFunction = ExpressNextFunction;
