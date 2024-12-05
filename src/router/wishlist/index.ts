import { Router } from "express";
import { asyncHandler } from "../../helper/asyncHandler";
import wishlistController from "../../controller/wishlist.controller";
import { authentication } from "../../auth/auth";
const router = Router();

router.use(authentication);
router.post(
  "/addProductToWishList",
  asyncHandler(wishlistController.addProductToWishList)
);
router.delete(
  "/deleteProductInWishlist/:productId",
  asyncHandler(wishlistController.removeProductInWishlish)
);
router.get(
  "/getAllProWishlist",
  asyncHandler(wishlistController.getAllProductInWishList)
);
export default router;
