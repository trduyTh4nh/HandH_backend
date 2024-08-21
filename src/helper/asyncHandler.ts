import { NextFunction, Request, Response } from "../types/type.express"

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// const asyncHandler = (fn: AsyncHandler) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         Promise.resolve(fn(req, res, next)).catch(next)
//     }
// }

// const asyncHandler = (fn: AsyncHandler) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         Promise.resolve(fn(req, res, next)).catch(next);
//     };
// };

const asyncHandler = (fn: AsyncHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};


export { asyncHandler };