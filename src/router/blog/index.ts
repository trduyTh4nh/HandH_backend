import { Router } from "express";
import { authentication, checkRoleAd } from "../../auth/auth";
import { asyncHandler } from "../../helper/asyncHandler";
import blogController from "../../controller/blog.controller";

const router = Router();

router.get("/getAllBlogPost", asyncHandler(blogController.getAllBlog));
router.use(authentication);
router.use(checkRoleAd);
router.post("/createBlogPost", asyncHandler(blogController.createBlog));
router.put("/updateBlogPost", asyncHandler(blogController.updateBlog));
router.delete(
  "/deleteBlogPost/:id",
  asyncHandler(blogController.deleteBlogPost)
);
export default router;
