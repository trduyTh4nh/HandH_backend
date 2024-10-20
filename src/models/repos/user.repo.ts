import { bucket } from "../../configs/storage";
import { BadRequestError } from "../../core/error.response";
import { IProduct, IUser, IUserData } from "../../types/type.all";
import { _idConverted, uploadImage } from "../../utils";
import User from "../user.model";

const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne({ email: email });
  return user;
};

const findUserByEmail_ = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne({ email: email });
  return user;
};

const findUserById = async (_id: string): Promise<IUser | null> => {
  return await User.findOne({
    _id: _idConverted(_id),
  });
};

const updateInfoUser = async (user: IUser, idUser: string): Promise<any> => {
  const { email, name, birthDay, phone, userAddress } = user;

  const updateData: Partial<IUser> = {};

  if (email) {
    const checkMail = await User.findOne({ email });
    if (checkMail) {
      throw new BadRequestError("Email is in use!");
    }

    updateData.email = email;
  }
  if (name) updateData.name = name;
  if (birthDay) updateData.birthDay = birthDay;
  if (phone) updateData.phone = phone;
  if (userAddress) updateData.userAddress = userAddress; // cái này nếu k được thì có thể làm api update địa chỉ riêng

  if (Object.keys(updateData).length > 0) {
    const updateUser = await User.findByIdAndUpdate(
      _idConverted(idUser),
      updateData,
      { new: true }
    );

    return updateUser;
  } else {
    throw new BadRequestError("Not data to update");
  }
};

const updateAvatarForUser = async (
  idUser: string,
  image: any
): Promise<any> => {
  const foundUserToUpdate = await findUserById(idUser);

  if (!foundUserToUpdate) {
    throw new BadRequestError("Not found user to update!");
  }

  if (!image) {
    throw new BadRequestError("Not found image to update!");
  }

  console.log(foundUserToUpdate);

  const fileName =
    foundUserToUpdate.avatar?.split("/").pop() === undefined
      ? foundUserToUpdate.name?.split("/").pop()
      : foundUserToUpdate.avatar?.split("/").pop();
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
  const imageResult: any = await uploadImage(image);

  foundUserToUpdate.avatar = imageResult.publicUrl;

  return await foundUserToUpdate.save();
};

const getAllUserFunc = async () => {
  const users = await User.find({
    role: process.env.ROLEUSER,
  });

  return users;
};

export {
  findUserByEmail,
  findUserByEmail_,
  findUserById,
  updateInfoUser,
  updateAvatarForUser,
  getAllUserFunc,
};
