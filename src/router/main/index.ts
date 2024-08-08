import { Router } from "express";

const router = Router()

import access from '../access/index'

router.use('/v1/api/access', access)

export default router