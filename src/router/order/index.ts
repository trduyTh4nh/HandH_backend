import { Router } from "express";
import { authentication, checkRoleAd } from "../../auth/auth";
import { asyncHandler } from "../../helper/asyncHandler";
import orderController from "../../controller/order.controller";

const router = Router();

router.use(authentication);
router.post(
  "/createOrderFromCart",
  asyncHandler(orderController.createOrderFromCart)
);
router.get("/getAOrder/:id", asyncHandler(orderController.getAOrder));
router.get(
  "/getAllOrderOfUser/:id",
  asyncHandler(orderController.getAllOrderOfUser)
);
router.delete("/deleteOrder/:id", asyncHandler(orderController.deleteOrder));
router.use(checkRoleAd);
router.get("/getAllOrder", asyncHandler(orderController.getAllOrder));
router.put(
  "/updateStatusOrder",
  asyncHandler(orderController.updateStatusForOrder)
);
export default router;
