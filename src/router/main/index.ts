import { Router } from "express";

const router = Router()

import access from '../access/index'
import product from '../product/index'
import category from '../category/index'
import cart from "../cart_/index"

router.use('/v1/api/access', access)
router.use('/v1/api/product', product)
router.use('/v1/api/category', category)
router.use('/v1/api/cart', cart)

export default router