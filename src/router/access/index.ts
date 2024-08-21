import { Router } from "express";
import accessController from "../../controller/access.controller";
import { asyncHandler } from "../../helper/asyncHandler";

const router = Router()

router.post('/register', asyncHandler(accessController.register))
router.post('/login', asyncHandler(accessController.login))

export default router