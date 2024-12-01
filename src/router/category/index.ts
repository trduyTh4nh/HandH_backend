import { Router } from "express";
import { authentication, checkRoleAd } from "../../auth/auth";
import { asyncHandler } from "../../helper/asyncHandler";
import categoryController from "../../controller/category.controller";
const router = Router();
router.get("/", asyncHandler(categoryController.getAllCategory));
router.get("/:id", asyncHandler(categoryController.getACategory));
router.get(
  "/getQUantityProductOfCate/:id",
  asyncHandler(categoryController.getQuantityProductOfCategory)
);
router.use(authentication);
router.use(checkRoleAd);
router.post("/", asyncHandler(categoryController.createCategory));
router.delete("/:id", asyncHandler(categoryController.deleteCategory));
router.put("/:id", asyncHandler(categoryController.updateCategory));
router.post(
  "/createCategory",
  asyncHandler(categoryController.createCategoryV2)
);
export default router;
