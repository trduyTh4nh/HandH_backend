import { forEach } from "lodash";
import { BadRequestError } from "../../core/error.response";
import { EStatusOrder, IOrder, IUserAddress } from "../../types/type.all";
import { _idConverted } from "../../utils";
import Cart from "../cart.model";
import OrderModel from "../order.model";
import User from "../user.model";
import ProductModel from "../product.model";

const getAllOrderOfUser = async (idUser: string) => {
  const foundUser = await User.findOne({
    _id: idUser,
  });

  if (!foundUser) {
    throw new BadRequestError("Not found user!");
  }

  const result = await OrderModel.find({
    userId: foundUser._id,
  });

  return result;
};

const getAOrderOfUser = async (idOrder: string): Promise<any> => {
  if (!idOrder) {
    throw new BadRequestError("Missing id order!");
  }
  const result = await OrderModel.findOne({
    _id: idOrder,
  });
  return result;
};

const deleteOrder = async (idOrder: string) => {
  const result = await OrderModel.deleteOne({ _id: idOrder });
  return result;
};

const createOrderFromCartFunc = async (
  cartId: string,
  userId: string,
  shippingAddress: IUserAddress,
  paymentMethod: string,
  notes: string,
  cartDetails: string[]
): Promise<any> => {
  const cart = await Cart.findOne({
    _id: cartId,
    cart_user: userId,
  }).populate("cart_products.product");

  if (!cart) throw new BadRequestError("Cart not found or already purchase!");

  // chỗ này sửa lại chỗ tạo cart là
  // truyền id product vào sao đó find product đó gắn vào
  // field product trong cart product của cart

  if (!cartDetails || cartDetails.length <= 0) {
    throw new BadRequestError("Not found product to create order!");
  }

  const foundProductToMatch = async (idPro: string) => {
    return await ProductModel.findOne({ _id: idPro });
  };

  // chỗ này dùng promise.all để có thể đảm bảo function bên trong hoạt động
  // đồng bộ nghĩa là chạy tuần tự function tìm sản phẩm để lấy thông tin

  const orderProducts = await Promise.all(
    cart.cart_products.map(async (cartDetail) => {
      const matchProduct = cartDetails.find(
        (id) => id === cartDetail.id.toString()
      );

      if (!matchProduct) return null;

      const productMatched = await foundProductToMatch(
        cartDetail.product._id.toString()
      );

      return {
        id: cartDetail._id,
        productId: cartDetail.product._id,
        product_category: productMatched!.product_category,
        product_price: productMatched!.product_price,
        product_description: productMatched!.product_description,
        product_thumb: productMatched!.product_thumb,
        product_name: productMatched!.product_name,
        quantity: cartDetail.quantity,
        priceAtPurchase: cartDetail.priceCartDetail,
        size: cartDetail.size,
        color: cartDetail.color,
      };
    })
  );

  // loại bổ các đơn hàng null
  const filteredOrderProducts = orderProducts.filter((item) => item !== null);

  if (filteredOrderProducts.length === 0) {
    throw new BadRequestError("No valid products found to create the order!");
  }

  const order = new OrderModel({
    userId: userId,
    cartId: cart._id,
    products: orderProducts,
    totalPrice: cart.cart_total_price,
    shippingAddress: shippingAddress,
    paymentMethod: paymentMethod,
    orderStatus: EStatusOrder.PENDING,
    orderDate: new Date(),
    notes: notes,
  });

  await order.save();
  // cập nhật trạng thái cho cart
  cart.cart_status = "purchased";
  await cart.save();
  return order;
};

const getAllOrderFunc = async () => {
  const result = await OrderModel.find();
  return result;
};

const updateStatusForOrderFunc = async (status: string, idOrder: string) => {
  const findOrder = await OrderModel.findOne({ _id: idOrder });
  if (!findOrder) {
    throw new BadRequestError("Order not found for updating status!");
  }

  switch (status) {
    case EStatusOrder.PENDING:
      findOrder.orderStatus = EStatusOrder.PENDING;
      break;
    case EStatusOrder.COMPLETED:
      findOrder.orderStatus = EStatusOrder.COMPLETED;
      break;
    case EStatusOrder.FAILED:
      findOrder.orderStatus = EStatusOrder.FAILED;
      break;
    case EStatusOrder.PACKING:
      findOrder.orderStatus = EStatusOrder.PACKING;
      break;
    default:
      throw new BadRequestError("Invalid status for updating order!");
  }

  return await findOrder.save();
};

export {
  getAllOrderOfUser,
  getAOrderOfUser,
  deleteOrder,
  createOrderFromCartFunc,
  getAllOrderFunc,
  updateStatusForOrderFunc,
};
