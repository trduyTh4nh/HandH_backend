import { BadRequestError } from "../core/error.response";
import {
  createBlogPostFunc,
  deleteBlog,
  getAllBlog,
  updateBlogV2,
} from "../models/repos/blog.repo";
import { IBlogPost } from "../types/type.all";

class BlogService {
  static async createBlogPost(content: string, idUser: string, file: any) {
    return await createBlogPostFunc(content, idUser, file);
  }

  static async updateBlogPost(
    idBlog: string,
    updateBlog: any,
    arrPositionImage: string
  ): Promise<any> {
    console.log("idBlog: ", idBlog);
    console.log("updateBlog: ", updateBlog);
    console.log("arrPositionImage: ", JSON.parse(arrPositionImage));

    return await updateBlogV2(idBlog, updateBlog, JSON.parse(arrPositionImage));
  }

  static async getAllBlog() {
    return await getAllBlog();
  }

  static async deleteBlog(idBlog: string) {
    if (!idBlog) {
      throw new BadRequestError("Missing blog post to delete!");
    }
    return await deleteBlog(idBlog);
  }
}

export default BlogService;
