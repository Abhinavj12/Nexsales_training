const orderService = require("../services/order-service");
const {
  orderQuerySchema,
  adminOrderQuerySchema,
  updateOrderStatusSchema
} = require("../validations/order-validation");
const createOrder = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await orderService.createOrderFromCart(
        req.user.id
      );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};
const getMyOrders = async (
  req,
  res,
  next
) => {
  try {
    const query =
      orderQuerySchema.parse(
        req.query
      );

    const result =
      await orderService.getMyOrders(
        req.user.id,
        query
      );

    return res.status(200).json({
      success: true,
      message:
        "Orders retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
const getMyOrderById = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await orderService.getMyOrderById(
        req.user.id,
        req.params.orderId
      );

    return res.status(200).json({
      success: true,
      message:
        "Order retrieved successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};
const getAllOrders = async (
  req,
  res,
  next
) => {
  try {
    const query =
      adminOrderQuerySchema.parse(
        req.query
      );

    const result =
      await orderService.getAllOrders(
        query
      );

    return res.status(200).json({
      success: true,
      message:
        "Orders retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
const updateOrderStatus = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      updateOrderStatusSchema.parse(
        req.body
      );

    const order =
      await orderService.updateOrderStatus(
        req.params.orderId,
        validatedData.status
      );

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus
};