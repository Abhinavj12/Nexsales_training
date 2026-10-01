const {
  Cart,
  CartItem,
  Product,
  ProductImage,
  Category
} = require("@ecommerce/ecommerce-data-model");

const getMyCart = async (userId) => {
  let cart = await Cart.findOne({
    where: {
      user_id: userId
    },
    include: [
      {
        model: CartItem,
        as: "items",
        attributes: [
          "id",
          "product_id",
          "quantity",
          "createdAt",
          "updatedAt"
        ],
        include: [
          {
            model: Product,
            as: "product",
            attributes: [
              "id",
              "sku",
              "name",
              "description",
              "price",
              "stock_quantity",
              "status"
            ],
            include: [
              {
                model: Category,
                as: "category",
                attributes: [
                  "id",
                  "name"
                ]
              },
              {
                model: ProductImage,
                as: "images",
                attributes: [
                  "id",
                  "image_url",
                  "is_primary",
                  "sort_order"
                ]
              }
            ]
          }
        ]
      }
    ],
    order: [
      [
        "items",
        "createdAt",
        "ASC"
      ]
    ]
  });

  // Create cart automatically if user
  // doesn't have one yet.
  if (!cart) {
    cart = await Cart.create({
      user_id: userId
    });

    return {
      id: cart.id,
      user_id: cart.user_id,
      items: []
    };
  }

  return cart;
};
const addToCart = async (
  userId,
  data
) => {
  // 1. Find or create user's cart
  let cart = await Cart.findOne({
    where: {
      user_id: userId
    }
  });

  if (!cart) {
    cart = await Cart.create({
      user_id: userId
    });
  }

  // 2. Check product
  const product = await Product.findOne({
    where: {
      id: data.product_id,
      status: "ACTIVE"
    }
  });

  if (!product) {
    const error = new Error(
      "Active product not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // 3. Check stock
  if (
    data.quantity >
    product.stock_quantity
  ) {
    const error = new Error(
      "Insufficient product stock"
    );

    error.statusCode = 409;

    throw error;
  }

  // 4. Check if product already exists
  const existingItem =
    await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id: data.product_id
      }
    });

  if (existingItem) {
    const newQuantity =
      existingItem.quantity +
      data.quantity;

    // Check total quantity against stock
    if (
      newQuantity >
      product.stock_quantity
    ) {
      const error = new Error(
        "Requested quantity exceeds available stock"
      );

      error.statusCode = 409;

      throw error;
    }

    existingItem.quantity =
      newQuantity;

    await existingItem.save();

    return existingItem;
  }

  // 5. Create new cart item
  const cartItem =
    await CartItem.create({
      cart_id: cart.id,
      product_id: data.product_id,
      quantity: data.quantity
    });

  return cartItem;
};
const updateCartItem = async (
  userId,
  itemId,
  quantity
) => {
  // 1. Find user's cart
  const cart = await Cart.findOne({
    where: {
      user_id: userId
    }
  });

  if (!cart) {
    const error = new Error(
      "Cart not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // 2. Find item belonging to this cart
  const cartItem =
    await CartItem.findOne({
      where: {
        id: itemId,
        cart_id: cart.id
      },

      include: [
        {
          model: Product,
          as: "product"
        }
      ]
    });

  if (!cartItem) {
    const error = new Error(
      "Cart item not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // 3. Make sure product is still active
  if (
    cartItem.product.status !==
    "ACTIVE"
  ) {
    const error = new Error(
      "Product is no longer available"
    );

    error.statusCode = 409;

    throw error;
  }

  // 4. Check stock
  if (
    quantity >
    cartItem.product.stock_quantity
  ) {
    const error = new Error(
      "Requested quantity exceeds available stock"
    );

    error.statusCode = 409;

    throw error;
  }

  // 5. Update quantity
  cartItem.quantity = quantity;

  await cartItem.save();

  return cartItem;
};
const removeCartItem = async (
  userId,
  itemId
) => {
  // Find user's cart
  const cart = await Cart.findOne({
    where: {
      user_id: userId
    }
  });

  if (!cart) {
    const error = new Error(
      "Cart not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // Make sure item belongs to user's cart
  const cartItem =
    await CartItem.findOne({
      where: {
        id: itemId,
        cart_id: cart.id
      }
    });

  if (!cartItem) {
    const error = new Error(
      "Cart item not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await cartItem.destroy();

  return {
    id: cartItem.id
  };
};
const clearCart = async (
  userId
) => {
  const cart = await Cart.findOne({
    where: {
      user_id: userId
    }
  });

  if (!cart) {
    const error = new Error(
      "Cart not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await CartItem.destroy({
    where: {
      cart_id: cart.id
    }
  });

  return {
    cart_id: cart.id
  };
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};