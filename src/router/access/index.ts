import { Router } from "express";
import accessController from "../../controller/access.controller";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, checkRoleAd } from "../../auth/auth";

const router = Router();

router.post("/register", asyncHandler(accessController.register));
router.post("/login", asyncHandler(accessController.login));
router.use(authentication);
router.get("/getUser/:id", asyncHandler(accessController.getUser));
router.put("/changePassword", asyncHandler(accessController.changePassword));
router.post("/refreshToken", asyncHandler(accessController.handleRefreshToken));
router.post("/logout", asyncHandler(accessController.logout));
router.put(
  "/updateInformationUser/:id",
  asyncHandler(accessController.updateUserInformation)
);
router.post(
  "/updateImageForUser/:id",
  asyncHandler(accessController.updateAvatarForUser)
);

router.use(checkRoleAd);

router.get("/getAllUser", asyncHandler(accessController.getAllUser));

export default router;
