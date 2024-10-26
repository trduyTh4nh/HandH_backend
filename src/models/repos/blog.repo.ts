import { ObjectId } from "mongodb";
import { BadRequestError } from "../../core/error.response";
import { IBlogPost, IUser } from "../../types/type.all";
import { _idConverted, deleteImageOnBucket, uploadImage } from "../../utils";
import Blog from "../blog.model";
import User from "../user.model";

const createBlogPostFunc = async (
  content: string,
  idUser: string,
  file: any
) => {
  if (!idUser) {
    throw new BadRequestError("User ID is required!");
  }

  const findUser = await User.findById(idUser);

  if (!findUser) {
    throw new BadRequestError("Not found user for post!");
  }

  // const blogPost: any = {
  //   content: "",
  //   images: [],
  //   author: findUser,
  //   datePosted: Date.now().toString(),
  // };

  const images = [];
  if (file.length > 0) {
    for (let i = 0; i < file.length; i++) {
      const imagesUpload: any = await uploadImage(file[i]);
      images.push(imagesUpload.publicUrl);
    }
  }

  const newBlogPost = await Blog.create({
    content: content,
    images: images,
    author: findUser._id,
    datePosted: Date.now(),
  });

  return newBlogPost;
};

const getABlog = async (idBlog: string) => {
  if (!idBlog) {
    throw new BadRequestError("Missing blog!");
  }
  const blog = await Blog.findOne({ _id: idBlog });
  return blog;
};

const getAllBlog = async () => {
  return await Blog.find();
};

const updateBlog = async (
  idBlog: string,
  updatedBlog: IBlogPost,
  arrPositionImage?: number[]
) => {
  const foundBlog = await Blog.findOne({ _id: idBlog });

  if (!foundBlog) {
    throw new BadRequestError("Not found blogPost to update!");
  }

  foundBlog.dateEdited = Date.now().toString();

  const { content, images } = updatedBlog;

  const updateData: Partial<IBlogPost> = {};

  if (content) updateData.content = content;
  if (images) {
    if (arrPositionImage!.length <= 0) {
      throw new BadRequestError("Not found position to update image for post!");
    }
    // arrPosition là mảng vị trí ảnh của  post đc update
    if (arrPositionImage!.length > 0) {
      // xóa ảnh hiện tại có trên firebase để update ảnh mới vảo ảnh có vị trí trong mảng
      // arrPosition
      for (let i = 0; i < arrPositionImage!.length; i++) {
        const fileName = foundBlog.images[arrPositionImage![i]]
          .split("/")
          .pop();
        if (fileName) {
          await deleteImageOnBucket(fileName);
        }
      }
      // tiến hành update lại ảnh mới
      for (let i = 0; i < arrPositionImage!.length; i++) {
        for (let j = 0; j < images.length; j++) {
          const newImageForPost = await uploadImage(images[j]);
          foundBlog.images[arrPositionImage![i]] = newImageForPost.publicUrl;
        }
      }
    }
  }

  return await foundBlog.save();
};

const updateBlogV2 = async (
  idBlog: string,
  updatedBlog: IBlogPost,
  arrPositionImage?: number[]
) => {
  const foundBlog = await Blog.findById(idBlog);
  if (!foundBlog) {
    throw new BadRequestError("Blog post not found!");
  }

  const { content, images } = updatedBlog;
  const updateData: Partial<IBlogPost> = {
    dateEdited: new Date().toISOString(),
  };

  if (content) updateData.content = content;

  if (images && arrPositionImage && arrPositionImage.length > 0) {
    if (images.length !== arrPositionImage.length) {
      throw new BadRequestError("Image count must match position count.");
    }

    for (let i = 0; i < arrPositionImage.length; i++) {
      const position = arrPositionImage[i];
      if (position < 0 || position >= foundBlog.images.length) {
        throw new BadRequestError(`Invalid image position: ${position}`);
      }

      const oldImageFileName = foundBlog.images[position].split("/").pop();
      if (oldImageFileName) {
        await deleteImageOnBucket(oldImageFileName);
      }

      const newImageUpload = await uploadImage(images[i]);
      foundBlog.images[position] = newImageUpload.publicUrl;
    }
  } else if (images) {
    throw new BadRequestError(
      "Image positions are required when updating images."
    );
  }

  Object.assign(foundBlog, updateData);

  return await foundBlog.save();
};

const deleteBlog = async (idBlog: string) => {
  const findPostToDelete = await Blog.findOne({ _id: idBlog });

  if (!findPostToDelete) {
    throw new BadRequestError("Not found blog post to delete!");
  }
  return await Blog.deleteOne({ _id: idBlog });
};

export {
  createBlogPostFunc,
  getABlog,
  getAllBlog,
  updateBlog,
  updateBlogV2,
  deleteBlog,
};
