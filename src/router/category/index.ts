import { Router } from "express";
import { authentication } from "../../auth/auth";
import { asyncHandler } from "../../helper/asyncHandler";
import categoryController from "../../controller/category.controller";
const router = Router()
router.get('/', asyncHandler(categoryController.getAllCategory))
router.get('/:id', asyncHandler(categoryController.getACategory))
router.use(authentication)
router.post('/', asyncHandler(categoryController.createCategory))
router.delete('/:id', asyncHandler(categoryController.deleteCategory))
router.put('/:id', asyncHandler(categoryController.updateCategory))


export default router