const OrderService =
  require("../services/order-service");

const {
  orderQuerySchema,
  adminOrderQuerySchema,
  updateOrderStatusSchema
} = require("../validations/order-validation");


class OrderController {

  constructor() {
    // Order business logic is handled by OrderService
    this.service = new OrderService();
  }


  // Create order from logged-in user's cart
  async createOrder(
    req,
    res,
    next
  ) {

    try {

      const order =
        await this.service.createOrderFromCart(
          req.user.id
        );

      return res.status(201).json({
        success: true,
        message:
          "Order created successfully",
        data: order
      });

    } catch (error) {
      next(error);
    }
  }


  // Get logged-in user's orders
  async getMyOrders(
    req,
    res,
    next
  ) {

    try {

      const query =
        orderQuerySchema.parse(
          req.query
        );

      const result =
        await this.service.getMyOrders(
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
  }


  // Get one order belonging to logged-in user
  async getMyOrderById(
    req,
    res,
    next
  ) {

    try {

      const order =
        await this.service.getMyOrderById(
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
  }


  // Admin: get all orders
  async getAllOrders(
    req,
    res,
    next
  ) {

    try {

      const query =
        adminOrderQuerySchema.parse(
          req.query
        );

      const result =
        await this.service.getAllOrders(
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
  }


  // Admin: update order status
  async updateOrderStatus(
    req,
    res,
    next
  ) {

    try {

      const validatedData =
        updateOrderStatusSchema.parse(
          req.body
        );

      const order =
        await this.service.updateOrderStatus(
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
  }
}


module.exports = OrderController;