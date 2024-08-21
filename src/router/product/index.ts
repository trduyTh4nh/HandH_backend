

import { Router } from "express"
import { asyncHandler } from "../../helper/asyncHandler"
import productController from "../../controller/product.controller"
import { authentication } from "../../auth/auth"

const router = Router()
router.use(authentication)
router.get('/', asyncHandler(productController.getAllProduct))

export default router