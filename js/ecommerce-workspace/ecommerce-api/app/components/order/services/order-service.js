const {
  sequelize,
  User,
  Cart,
  CartItem,
  Product,
  ProductImage,
  Order,
  OrderItem
} = require("@ecommerce/ecommerce-data-model");

const {
  sendOrderPlacedEmail,
  sendOrderStatusEmail
} = require("../../../services/mail-service");

const createOrderFromCart = async (userId) => {
  const transaction =
    await sequelize.transaction();

  try {
    // 1. Get user's cart and cart items
    const cart = await Cart.findOne({
      where: {
        user_id: userId
      },

      include: [
        {
          model: CartItem,
          as: "items"
        }
      ],

      transaction
    });

    if (!cart) {
      const error = new Error(
        "Cart not found"
      );

      error.statusCode = 404;

      throw error;
    }

    // 2. Cart cannot be empty
    if (
      !cart.items ||
      cart.items.length === 0
    ) {
      const error = new Error(
        "Cart is empty"
      );

      error.statusCode = 400;

      throw error;
    }

    let totalAmount = 0;

    const orderItems = [];

    // 3. Lock and validate every product
    for (const cartItem of cart.items) {
      const product =
        await Product.findOne({
          where: {
            id: cartItem.product_id
          },

          transaction,

          lock: transaction.LOCK.UPDATE
        });

      if (
        !product ||
        product.status !== "ACTIVE"
      ) {
        const error = new Error(
          `Product is no longer available: ${cartItem.product_id}`
        );

        error.statusCode = 409;

        throw error;
      }

      // 4. Check stock AFTER locking product
      if (
        cartItem.quantity >
        product.stock_quantity
      ) {
        const error = new Error(
          `Insufficient stock for product: ${product.name}`
        );

        error.statusCode = 409;

        throw error;
      }

      // 5. Take price from locked DB product
      const unitPrice =
        Number(product.price);

      const lineTotal =
        unitPrice *
        cartItem.quantity;

      totalAmount += lineTotal;

      orderItems.push({
        product_id:
          product.id,

        quantity:
          cartItem.quantity,

        unit_price:
          unitPrice,

        line_total:
          lineTotal,

        product
      });
    }

    // 6. Create order
    const order =
      await Order.create(
        {
          user_id: userId,
          status: "PENDING",
          total_amount:
            totalAmount
        },
        {
          transaction
        }
      );

    // 7. Create order items
    for (const item of orderItems) {
      await OrderItem.create(
        {
          order_id: order.id,

          product_id:
            item.product_id,

          quantity:
            item.quantity,

          unit_price:
            item.unit_price,

          line_total:
            item.line_total
        },
        {
          transaction
        }
      );
    }

    // 8. Reduce stock
    for (const item of orderItems) {
      const product =
        item.product;

      product.stock_quantity -=
        item.quantity;

      await product.save({
        transaction
      });
    }

    // 9. Clear cart
    await CartItem.destroy({
      where: {
        cart_id: cart.id
      },

      transaction
    });

    // 10. Commit everything
    await transaction.commit();

    // Send email AFTER successful DB commit.
// Email failure should not roll back the order.
try {
  const user = await User.findByPk(userId, {
    attributes: [
      "first_name",
      "email"
    ]
  });

  if (user) {
    await sendOrderPlacedEmail({
      email: user.email,
      firstName: user.first_name,
      orderId: order.id,
      totalAmount: order.total_amount
    });
  }
} catch (emailError) {
  console.error(
    "Order placed email failed:",
    emailError.message
  );
}

    return {
      id: order.id,

      user_id:
        order.user_id,

      status:
        order.status,

      total_amount:
        order.total_amount,

      items: orderItems.map(
        (item) => ({
          product_id:
            item.product_id,

          quantity:
            item.quantity,

          unit_price:
            item.unit_price,

          line_total:
            item.line_total
        })
      )
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};
const getMyOrders = async (
  userId,
  query
) => {
  const {
    status,
    page = 1,
    limit = 10
  } = query;

  const where = {
    user_id: userId
  };

  if (status) {
    where.status = status;
  }

  const offset =
    (page - 1) * limit;

  const {
    rows,
    count
  } = await Order.findAndCountAll({
    where,

    attributes: [
      "id",
      "status",
      "total_amount",
      "createdAt",
      "updatedAt"
    ],

    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: [
          "id",
          "product_id",
          "quantity",
          "unit_price",
          "line_total"
        ],

        include: [
          {
            model: Product,
            as: "product",
            attributes: [
              "id",
              "sku",
              "name"
            ]
          }
        ]
      }
    ],

    order: [
      ["createdAt", "DESC"]
    ],

    limit,
    offset,

    distinct: true
  });

  return {
    orders: rows,

    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(
        count / limit
      )
    }
  };
};
const getMyOrderById = async (
  userId,
  orderId
) => {
  const order =
    await Order.findOne({
      where: {
        id: orderId,
        user_id: userId
      },

      attributes: [
        "id",
        "user_id",
        "status",
        "total_amount",
        "createdAt",
        "updatedAt"
      ],

      include: [
        {
          model: OrderItem,
          as: "items",

          attributes: [
            "id",
            "product_id",
            "quantity",
            "unit_price",
            "line_total",
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
                "status"
              ],

              include: [
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
      ]
    });

  if (!order) {
    const error = new Error(
      "Order not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return order;
};

// Admin order service

const getAllOrders = async (query) => {
  const {
    status,
    page = 1,
    limit = 10
  } = query;

  const where = {};

  if (status) {
    where.status = status;
  }

  const offset =
    (page - 1) * limit;

  const {
    rows,
    count
  } = await Order.findAndCountAll({
    where,

    attributes: [
      "id",
      "user_id",
      "status",
      "total_amount",
      "createdAt",
      "updatedAt"
    ],

    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: [
          "id",
          "product_id",
          "quantity",
          "unit_price",
          "line_total"
        ],

        include: [
          {
            model: Product,
            as: "product",
            attributes: [
              "id",
              "sku",
              "name"
            ]
          }
        ]
      }
    ],

    order: [
      ["createdAt", "DESC"]
    ],

    limit,
    offset,

    distinct: true
  });

  return {
    orders: rows,

    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(
        count / limit
      )
    }
  };
};
const updateOrderStatus = async (
  orderId,
  newStatus
) => {
  const transaction =
    await sequelize.transaction();

  try {
    // 1. Find and lock the order
    const order =
      await Order.findByPk(
        orderId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE
        }
      );

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      throw error;
    }

    // 2. Allowed status transitions
    const allowedTransitions = {
      PENDING: [
        "CANCELLED"
      ],

      CONFIRMED: [
        "PROCESSING",
        "CANCELLED"
      ],

      PROCESSING: [
        "SHIPPED",
        "CANCELLED"
      ],

      SHIPPED: [
        "DELIVERED"
      ],

      DELIVERED: [],

      CANCELLED: []
    };

    const allowedNextStatuses =
      allowedTransitions[
        order.status
      ];

    if (
      !allowedNextStatuses ||
      !allowedNextStatuses.includes(
        newStatus
      )
    ) {
      const error = new Error(
        `Cannot change order status from ${order.status} to ${newStatus}`
      );

      error.statusCode = 409;

      throw error;
    }

    // 3. If cancelling, restore stock
    if (newStatus === "CANCELLED") {
      const orderItems =
        await OrderItem.findAll({
          where: {
            order_id: order.id
          },
          transaction
        });

      for (const orderItem of orderItems) {
        const product =
          await Product.findByPk(
            orderItem.product_id,
            {
              transaction,
              lock: transaction.LOCK.UPDATE
            }
          );

        if (!product) {
          const error = new Error(
            `Product not found for order item: ${orderItem.product_id}`
          );

          error.statusCode = 404;

          throw error;
        }

        product.stock_quantity +=
          orderItem.quantity;

        await product.save({
          transaction
        });
      }
    }

    // 4. Update order status
    order.status = newStatus;

    await order.save({
      transaction
    });

    // 5. Commit
    await transaction.commit();

    return {
      id: order.id,

      user_id:
        order.user_id,

      status:
        order.status,

      total_amount:
        order.total_amount,

      createdAt:
        order.createdAt,

      updatedAt:
        order.updatedAt
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};
module.exports = {
  createOrderFromCart,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus
};