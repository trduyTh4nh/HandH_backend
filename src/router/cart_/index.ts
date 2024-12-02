import { Router } from "express";
import { authentication } from "../../auth/auth";
import { asyncHandler } from "../../helper/asyncHandler";
import cartController from "../../controller/cart.controller";
const router = Router();
/// nhớ thêm api lấy toàn bộ sản phẩm
router.use(authentication);
router.delete(
  "/deleteManyCartDetail",
  asyncHandler(cartController.removeManyProductInCart)
);
router.post("/createCart", asyncHandler(cartController.createCart));
router.patch(
  "/addProductToCart",
  asyncHandler(cartController.addProductToCart)
);
router.post(
  "/removeProductInCart",
  asyncHandler(cartController.removeProductInCart)
);
router.put(
  "/decreaseQuantityProductIncart",
  asyncHandler(cartController.decreaseQuantity)
);
router.put(
  "/increaseQuantityProductIncart",
  asyncHandler(cartController.increaseQuantity)
);
router.get("/getCartUser/:id", asyncHandler(cartController.getCartOfUser));
export default router;
