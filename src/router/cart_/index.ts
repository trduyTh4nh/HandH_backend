import { Router } from "express";
import { authentication } from "../../auth/auth";
import { asyncHandler } from "../../helper/asyncHandler";
import cartController from "../../controller/cart.controller";
const router = Router()
/// nhớ thêm api lấy toàn bộ sản phẩm
router.post('/createCart', asyncHandler(cartController.createCart))
router.patch('/addProductToCart', asyncHandler(cartController.addProductToCart))
router.delete('/removeProductInCart', asyncHandler(cartController.removeProductInCart))
router.put('/decreaseQuantityProductIncart', asyncHandler(cartController.decreaseQuantity))
router.get('/getCartUser/:id', asyncHandler(cartController.getCartOfUser))
export default router