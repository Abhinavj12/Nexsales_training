const cartService = require("../services/cart-service");
const {
  addCartItemSchema,
  updateCartItemSchema
} = require("../validations/cart-validation");

const getMyCart = async (
  req,
  res,
  next
) => {
  try {
    const cart =
      await cartService.getMyCart(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      addCartItemSchema.parse(
        req.body
      );

    const cartItem =
      await cartService.addToCart(
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
};
const updateCartItem = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      updateCartItemSchema.parse(
        req.body
      );

    const cartItem =
      await cartService.updateCartItem(
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
};
const removeCartItem = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await cartService.removeCartItem(
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
};
const clearCart = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await cartService.clearCart(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart

};