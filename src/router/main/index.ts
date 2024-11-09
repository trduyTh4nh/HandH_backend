import { Router } from "express";

const router = Router();

import access from "../access/index";
import product from "../product/index";
import category from "../category/index";
import cart from "../cart_/index";
import upload from "../upload/index";
import wish from "../wishlist/index";
import blog from "../blog/index";
import order from "../order/index";

router.use("/v1/api/order", order);
router.use("/v1/api/blog", blog);
router.use("/v1/api/wishlist", wish);
router.use("/v1/api/upload", upload);
router.use("/v1/api/access", access);
router.use("/v1/api/product", product);
router.use("/v1/api/category", category);
router.use("/v1/api/cart", cart);

export default router;
