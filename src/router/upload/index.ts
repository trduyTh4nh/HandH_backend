import { Router } from "express";
import { authentication, checkRoleAd } from "../../auth/auth";
import { asyncHandler } from "../../helper/asyncHandler";
import uploadController from "../../controller/upload.controller";
import { upload } from "../../configs/storage";
import { updateAvatarForUser } from "../../models/repos/user.repo";

const router = Router();
router.get("/getABanner/:id", uploadController.getABanner);
router.get("/getAllBanner", asyncHandler(uploadController.getAllBanner));
router.use(authentication);
router.use(checkRoleAd);

router.put(
  "/addProductToBanner",
  asyncHandler(uploadController.addProductForBanner)
);
router.post("/uploadBanner", asyncHandler(uploadController.uploadBanner));
router.delete("/deleteBanner/:id", asyncHandler(uploadController.deleteBanner));
router.put("/activeBanner/:id", asyncHandler(uploadController.activeBanner));
router.put(
  "/unActiveBanner/:id",
  asyncHandler(uploadController.unActiveBanner)
);
router.put(
  "/updateModeBanner",
  asyncHandler(uploadController.updateModeBanner)
);
export default router;
