import { Router } from "express";
import accessController from "../../controller/access.controller";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication } from "../../auth/auth";

const router = Router()

router.post('/register', asyncHandler(accessController.register))
router.post('/login', asyncHandler(accessController.login))
router.use(authentication)
router.put('/changePassword', asyncHandler(accessController.changePassword))
router.post('/refreshToken', asyncHandler(accessController.handleRefreshToken))
router.post('/logout', asyncHandler(accessController.logout))
router.put('/updateInformationUser/:id', asyncHandler(accessController.updateUserInformation))
export default router