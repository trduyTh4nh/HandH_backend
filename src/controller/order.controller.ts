import { SuccessResponse } from "../core/success.response";
import {
  createOrderFromCartFunc,
  deleteOrder,
  getAllOrderFunc,
  getAllOrderOfUser,
  getAOrderOfUser,
  updateStatusForOrderFunc,
} from "../models/repos/order.repo";
import { IUserAddress } from "../types/type.all";
import { NextFunction, Request, Response } from "../types/type.express";

class OrderController {
  createOrderFromCart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const cartId = req.body.cartId;
    const userId = req.body.userId;
    const shippingAddress: IUserAddress = req.body.shippingAddress;
    const paymentMethod = req.body.paymentMethod;
    const notes = req.body.notes;
    const cartDetails: string[] = req.body.cartDetail;

    new SuccessResponse({
      message: "create order from cart successfully!",
      metadata: await createOrderFromCartFunc(
        cartId,
        userId,
        shippingAddress,
        paymentMethod,
        notes,
        cartDetails
      ),
    }).send(res);
  };

  getAOrder = async (req: Request, res: Response, next: NextFunction) => {
    const idOrder = req.params.id;
    new SuccessResponse({
      message: "get a order from cart successfully!",
      metadata: await getAOrderOfUser(idOrder),
    }).send(res);
  };

  getAllOrderOfUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const idUser = req.params.id;
    new SuccessResponse({
      message: "get all oder from cart successfully!",
      metadata: await getAllOrderOfUser(idUser),
    }).send(res);
  };

  deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const idOrder = req.params.id;
    new SuccessResponse({
      message: "get all oder from cart successfully!",
      metadata: await deleteOrder(idOrder),
    }).send(res);
  };

  getAllOrder = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "get all order successfully",
      metadata: await getAllOrderFunc(),
    }).send(res);
  };

  updateStatusForOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { idOrder, status } = req.body;
    new SuccessResponse({
      message: "update status order successfully!",
      metadata: await updateStatusForOrderFunc(status, idOrder),
    }).send(res);
  };
}

export default new OrderController();
