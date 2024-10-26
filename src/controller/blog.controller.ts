import { NextFunction, Request, Response } from "../types/type.express";
import { BadRequestError } from "../core/error.response";
import { SuccessResponse } from "../core/success.response";
import BlogService from "../service/blog.service";
import { IBlogPost } from "../types/type.all";

class BlogController {
  createBlog = async (req: Request, res: Response, next: NextFunction) => {
    const content: string = req.body.content;
    const user = req.body.idUser;
    const files = req.files;

    new SuccessResponse({
      message: "Create blog successfully!",
      metadata: await BlogService.createBlogPost(content, user, files),
    }).send(res);
  };

  updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    const idBlog = req.body.idBlog;
    const updateBlog: any = {
      content: req.body.content,
      images: req.files,
    };
    const arrPositionImage = req.body.arrPositionImage;

    new SuccessResponse({
      message: "Update blog post successfully!",
      metadata: await BlogService.updateBlogPost(
        idBlog,
        updateBlog,
        arrPositionImage
      ),
    }).send(res);
  };

  getAllBlog = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Get all blog successfully!",
      metadata: await BlogService.getAllBlog(),
    }).send(res);
  };

  deleteBlogPost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    new SuccessResponse({
      message: "delete blog post successfully!",
      metadata: await BlogService.deleteBlog(id),
    }).send(res);
  };
}

export default new BlogController();
