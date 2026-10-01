const CartService =
  require("../services/cart-service");

const {
  addCartItemSchema,
  updateCartItemSchema
} = require("../validations/cart-validation");


class CartController {

  constructor() {
    // Cart business logic is handled by CartService
    this.service = new CartService();
  }


  async getMyCart(
    req,
    res,
    next
  ) {

    try {

      const cart =
        await this.service.getMyCart(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        message:
          "Cart retrieved successfully",
        data: cart
      });

    } catch (error) {
      next(error);
    }
  }


  async addToCart(
    req,
    res,
    next
  ) {

    try {

      const validatedData =
        addCartItemSchema.parse(
          req.body
        );

      const cartItem =
        await this.service.addToCart(
          req.user.id,
          validatedData
        );

      return res.status(201).json({
        success: true,
        message:
          "Product added to cart successfully",
        data: cartItem
      });

    } catch (error) {
      next(error);
    }
  }


  async updateCartItem(
    req,
    res,
    next
  ) {

    try {

      const validatedData =
        updateCartItemSchema.parse(
          req.body
        );

      const cartItem =
        await this.service.updateCartItem(
          req.user.id,
          req.params.itemId,
          validatedData.quantity
        );

      return res.status(200).json({
        success: true,
        message:
          "Cart item quantity updated successfully",
        data: cartItem
      });

    } catch (error) {
      next(error);
    }
  }


  async removeCartItem(
    req,
    res,
    next
  ) {

    try {

      const result =
        await this.service.removeCartItem(
          req.user.id,
          req.params.itemId
        );

      return res.status(200).json({
        success: true,
        message:
          "Cart item removed successfully",
        data: result
      });

    } catch (error) {
      next(error);
    }
  }


  async clearCart(
    req,
    res,
    next
  ) {

    try {

      const result =
        await this.service.clearCart(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        message:
          "Cart cleared successfully",
        data: result
      });

    } catch (error) {
      next(error);
    }
  }
}


module.exports = CartController;