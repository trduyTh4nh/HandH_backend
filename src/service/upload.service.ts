import { BadRequestError } from "../core/error.response";
import { bucket } from "../configs/storage"; // Đảm bảo rằng bạn đã import bucket đúng cách
import { NextFunction, Request, Response } from "../types/type.express";
import Banner from "../models/banner.model";
import { _idConverted, uploadImage } from "../utils";

class UploadService {
  static async uploadBanner(req: Request, res: Response): Promise<any> {
    const file = req.files[0];
    const title = req.body.title;
    const content = req.body.content;

    if (!file) {
      throw new BadRequestError("No file uploaded!");
    }

    const result: any = await uploadImage(file);

    return await Banner.create({
      url: result.publicUrl,
      title: title,
      content: content,
    });
  }

  static async removeBanner(idBanner: string): Promise<any> {
    const foundBanner = await Banner.findOne({ _id: _idConverted(idBanner) });
    if (!foundBanner) {
      throw new BadRequestError("Not found banner!");
    }
    if (foundBanner.isActive) {
      throw new BadRequestError("Can not delete banner is acting!");
    }

    const deleteResult = await Banner.deleteOne({
      _id: _idConverted(idBanner),
    });

    const fileName = foundBanner.url.split("/").pop();
    const file = bucket.file(fileName);

    if (file) {
      await file
        .delete()
        .then(() => {
          console.log(`File ${fileName} deleted successfully.`);
        })
        .catch((error: any) => {
          console.error("Error deleting file from Firebase Storage:", error);
        });
    }

    return deleteResult;
  }

  static async unActiveBanner(idBanner: string): Promise<any> {
    const foundBanner = await Banner.findOne({ _id: _idConverted(idBanner) });
    if (!foundBanner) {
      throw new BadRequestError("Not found banner!");
    }
    foundBanner.isActive = false;
    return foundBanner.save();
  }

  static async activeBanner(idBanner: string): Promise<any> {
    const foundBanner = await Banner.findOne({ _id: _idConverted(idBanner) });
    if (!foundBanner) {
      throw new BadRequestError("Not found banner!");
    }
    foundBanner.isActive = true;
    return foundBanner.save();
  }

  static async getAllBanner(): Promise<any> {
    return await Banner.find();
  }

  static async updateProductForBanner(
    idBanner: string,
    product: string[]
  ): Promise<any> {
    const findBanner = await Banner.findOne({ _id: idBanner });

    if (!findBanner) {
      throw new BadRequestError("Not found banner to add product!");
    }

    findBanner.products = [...findBanner.products, ...product];
    return await findBanner.save();
  }

  static async updateModeBanner(idBanner: string, mode: boolean): Promise<any> {
    const foundBanner = await Banner.findOne({ _id: idBanner });

    if (!foundBanner) {
      throw new BadRequestError("Not found banner to update!");
    }

    const resultUpdate = await Banner.findOneAndUpdate(
      { _id: idBanner },
      { isMain: mode }
    );

    return resultUpdate;
  }

  static async getABanner(idBanner: string) {
    const foundBanner = await Banner.findOne({ _id: idBanner });
    console.log("foundBanner: ", foundBanner);
    if (!foundBanner) {
      throw new BadRequestError("Not found banner to get!");
    }
    return foundBanner;
  }
}

export default UploadService;
