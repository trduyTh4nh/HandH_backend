import { Router } from "express";

const router = Router()

import access from '../access/index'
import product from '../product/index'

router.use('/v1/api/access', access)
router.use('/v1/api/product', product)

export default router