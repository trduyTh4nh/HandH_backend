import express, { Request, Response, NextFunction } from 'express'

const app = express()
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import { prototype } from 'events'
import { BadRequestError, ErrorResponse } from './core/error.response'
import Product from './models/product.model'


// config
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


require('./db/init.mongo')

app.post('/create-product', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.create(req.body)

        res.status(201).json(product);

    } catch (error) {
        res.status(400).json({ message: error });
    }
})

// handling error
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new BadRequestError('Not found')
    error.status = 404
    next(error)
})

app.use((error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500
    console.log("Lỗi (app.ts): ", error)

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message
    })
})

export default app





