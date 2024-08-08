import { Router } from "express";
import accessController from "../../controller/access.controller";

const router = Router()

router.post('/register', accessController.register)

export default router