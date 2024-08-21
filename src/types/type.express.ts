import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from "express";
import { IKeyTokenModel, IUser, IUserAddress } from "./type.all";


interface CustomHeaderData {
    user?: IUser;
    keyStore?: IKeyTokenModel
}

export type Request = ExpressRequest & { headerData?: CustomHeaderData };
export type Response = ExpressResponse & { headerData?: CustomHeaderData };
export type NextFunction = ExpressNextFunction;
