import ecommerceApi from "../api/ecommerceApi";

export const addToCart = async (productId, quantity) => {
  try {
    const response = await ecommerceApi.post(
      "/cart/items",
      {
        product_id: productId,
        quantity: quantity
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Add to cart error:",
      error
    );

    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await ecommerceApi.get("/cart");

    return response.data;
  } catch (error) {
    console.error("Get cart error:", error);
    throw error;
  }
};

export const updateCartItem = async (
  itemId,
  quantity
) => {
  try {
    const response = await ecommerceApi.patch(
      `/cart/items/${itemId}`,
      {
        quantity
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update cart item error:",
      error
    );

    throw error;
  }
};

export const removeCartItem = async (itemId) => {
  try {
    const response = await ecommerceApi.delete(
      `/cart/items/${itemId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Remove cart item error:",
      error
    );

    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await ecommerceApi.delete(
      "/cart"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Clear cart error:",
      error
    );

    throw error;
  }
};