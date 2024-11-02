import { Router } from "express";
import { asyncHandler } from "../../helper/asyncHandler";
import productController from "../../controller/product.controller";
import { authentication, checkRoleAd } from "../../auth/auth";

const router = Router();

router.get("/getAProduct/:id", asyncHandler(productController.getAProduct));
router.get(
  "/getLastestProduct/:num",
  asyncHandler(productController.getNProductLastest)
);
router.get("/search", asyncHandler(productController.searchProduct));
router.get("/", asyncHandler(productController.getAllProduct));
router.get(
  "/getProductPage/:page",
  asyncHandler(productController.getProductPerPage)
);
router.get(
  "/getProductCate/:id",
  asyncHandler(productController.getProductFromCate)
);

router.post(
  "/searchProductFilter",
  asyncHandler(productController.searchFilterProduct)
);

router.use(authentication);

router.use(checkRoleAd);
router.put(
  "/unPublicProduct/:id",
  asyncHandler(productController.unPublicProduct)
);
router.patch(
  "/publicProduct/:id",
  asyncHandler(productController.publicProduct)
);
router.post("/createProduct", asyncHandler(productController.createAProduct));
router.put("/draftProduct/:id", asyncHandler(productController.draftProduct));
router.put(
  "/unDaftProduct/:id",
  asyncHandler(productController.undraftProduct)
);
router.put("/updateProduct/:id", asyncHandler(productController.updateProduct));
router.put("/addSizeProduct", asyncHandler(productController.addSizeProduct));
router.delete(
  "/removeSizeProduct",
  asyncHandler(productController.removeSizeProduct)
);
router.put("/addColorProduct", asyncHandler(productController.addColorProduct));
router.delete(
  "/removeColorProduct",
  asyncHandler(productController.removeColorProduct)
);
router.delete(
  "/deleteProduct/:id",
  asyncHandler(productController.deleteProductForever)
);

router.post(
  "/updateImageProduct/:id",
  asyncHandler(productController.updateImageForProduct)
);

router.put(
  "/addImageProduct/:id",
  asyncHandler(productController.addImageForProduct)
);
export default router;
