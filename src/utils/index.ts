import _ from "lodash";
import JWT from "jsonwebtoken";
import env from "dotenv";
import { IUser } from "../types/type.all";
import mongoose from "mongoose";
import { bucket } from "../configs/storage";
env.config();
const errorWriteDown = (error: any): string => {
  let errorMessage = "An error occurred";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return errorMessage;
};

const getInfoData = ({
  fields = [],
  object = {},
}: {
  fields: string[];
  object: {};
}) => {
  return _.pick(object, fields);
};

const verifyJWT = async (token: string, keySecret: string): Promise<any> => {
  return await JWT.verify(token, keySecret);
};

const adminPlayer = async (roleCurrent: string) => {
  return (await roleCurrent) === process.env.ROLEADMIN;
};

const _idConverted = (_id: string) => {
  return new mongoose.Types.ObjectId(_id);
};

async function uploadImage(file: any) {
  const fileName = `${Date.now()}-${file.originalname}`;
  const blob = bucket.file(fileName);

  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error: any) => {
      console.log("Upload error: ", error);
      reject({
        message: "Something went wrong while uploading the file",
        error: error.message || error,
      });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      console.log(publicUrl);
      resolve({
        message: "File uploaded successfully!",
        fileName: fileName,
        publicUrl: publicUrl,
      });
    });

    blobStream.end(file.buffer);
  })
    .then((result: any) => {
      return result;
    })
    .catch((error) => error);
}

async function deleteImageOnBucket(fileName: string) {
  // const fileName = findProductToUpdate.product_thumb?.split("/").pop();
  console.log("DEBUG file name: ", fileName);

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
}

export {
  errorWriteDown,
  getInfoData,
  verifyJWT,
  adminPlayer,
  _idConverted,
  uploadImage,
  deleteImageOnBucket,
};
