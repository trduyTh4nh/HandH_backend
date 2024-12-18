import { SuccessResponse } from "../core/success.response";
import UploadSerivice from "../service/upload.service";
import { NextFunction, Request, Response } from "../types/type.express";
class UploadController {
  uploadBanner = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Upload banner successfully!",
      metadata: await UploadSerivice.uploadBanner(req, res),
    }).send(res);
  };

  deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
    const idBanner = req.params.id;
    new SuccessResponse({
      message: "Delete banner successfully!",
      metadata: await UploadSerivice.removeBanner(idBanner),
    }).send(res);
  };

  unActiveBanner = async (req: Request, res: Response, next: NextFunction) => {
    const idBanner = req.params.id;
    new SuccessResponse({
      message: "Unactive banner successfully!",
      metadata: await UploadSerivice.unActiveBanner(idBanner),
    }).send(res);
  };

  activeBanner = async (req: Request, res: Response, next: NextFunction) => {
    const idBanner = req.params.id;
    new SuccessResponse({
      message: "Unactive banner successfully!",
      metadata: await UploadSerivice.activeBanner(idBanner),
    }).send(res);
  };

  getAllBanner = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Get all banner successfully!",
      metadata: await UploadSerivice.getAllBanner(),
    }).send(res);
  };

  addProductForBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const idBanner = req.body.idBanner;
    const products = req.body.products;

    new SuccessResponse({
      message: "Add product for banner successfully!",
      metadata: await UploadSerivice.updateProductForBanner(idBanner, products),
    }).send(res);
  };

  updateModeBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const bannerId = req.body.idBanner;
    const mode = req.body.mode;

    new SuccessResponse({
      message: "Update mode banner!",
      metadata: await UploadSerivice.updateModeBanner(bannerId, mode),
    }).send(res);
  };

  getABanner = async (req: Request, res: Response, next: NextFunction) => {
    const bannerId = req.params.id;
    new SuccessResponse({
      message: "Get a banner successfully!",
      metadata: await UploadSerivice.getABanner(bannerId),
    }).send(res);
  };
}

export default new UploadController();
