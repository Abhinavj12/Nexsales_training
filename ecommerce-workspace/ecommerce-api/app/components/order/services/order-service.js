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

const MailService =
  require("../../../services/mail-service");


class OrderService {

  constructor() {
    // Create MailService instance
    this.mailService =
      new MailService();
  }


  // ============================================================
  // CREATE ORDER FROM CART
  // ============================================================

  async createOrderFromCart(userId) {

    const transaction =
      await sequelize.transaction();

    try {

      // Get user's cart and cart items
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


      // Cart must contain at least one item
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


      // Lock products and validate stock
      for (const cartItem of cart.items) {

        const product =
          await Product.findOne({
            where: {
              id: cartItem.product_id
            },

            transaction,

            lock:
              transaction.LOCK.UPDATE
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


        // Check stock after locking product
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


      // Create order
      const order =
        await Order.create(
          {
            user_id:
              userId,

            status:
              "PENDING",

            total_amount:
              totalAmount
          },
          {
            transaction
          }
        );


      // Create order items
      for (const item of orderItems) {

        await OrderItem.create(
          {
            order_id:
              order.id,

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


      // Reduce product stock
      for (const item of orderItems) {

        const product =
          item.product;


        product.stock_quantity -=
          item.quantity;


        await product.save({
          transaction
        });
      }


      // Clear cart after creating order
      await CartItem.destroy({
        where: {
          cart_id:
            cart.id
        },

        transaction
      });


      // Commit database changes
      await transaction.commit();


      // ========================================================
      // SEND ORDER EMAIL AFTER DATABASE COMMIT
      // ========================================================

      try {

        const user =
          await User.findByPk(
            userId,
            {
              attributes: [
                "first_name",
                "email"
              ]
            }
          );


        if (user) {

          await this.mailService.sendOrderPlacedEmail({
            email:
              user.email,

            firstName:
              user.first_name,

            orderId:
              order.id,

            totalAmount:
              order.total_amount
          });
        }

      } catch (emailError) {

        // Email failure should not undo the order
        console.error(
          "Order placed email failed:",
          emailError.message
        );
      }


      return {

        id:
          order.id,

        user_id:
          order.user_id,

        status:
          order.status,

        total_amount:
          order.total_amount,

        items:
          orderItems.map(
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
  }


  // ============================================================
  // GET MY ORDERS
  // ============================================================

  async getMyOrders(
    userId,
    query
  ) {

    const {
      status,
      page = 1,
      limit = 10
    } = query;


    const where = {
      user_id:
        userId
    };


    if (status) {
      where.status =
        status;
    }


    const offset =
      (page - 1) *
      limit;


    const {
      rows,
      count
    } =
      await Order.findAndCountAll({

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
          [
            "createdAt",
            "DESC"
          ]
        ],

        limit,

        offset,

        distinct:
          true
      });


    return {

      orders:
        rows,

      pagination: {

        page,

        limit,

        totalItems:
          count,

        totalPages:
          Math.ceil(
            count / limit
          )
      }
    };
  }


  // ============================================================
  // GET MY ORDER BY ID
  // ============================================================

  async getMyOrderById(
    userId,
    orderId
  ) {

    const order =
      await Order.findOne({

        where: {
          id:
            orderId,

          user_id:
            userId
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
            model:
              OrderItem,

            as:
              "items",

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
                model:
                  Product,

                as:
                  "product",

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
                    model:
                      ProductImage,

                    as:
                      "images",

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

      const error =
        new Error(
          "Order not found"
        );

      error.statusCode =
        404;

      throw error;
    }


    return order;
  }


  // ============================================================
  // ADMIN - GET ALL ORDERS
  // ============================================================

  async getAllOrders(query) {

    const {
      status,
      page = 1,
      limit = 10
    } = query;


    const where = {};


    if (status) {
      where.status =
        status;
    }


    const offset =
      (page - 1) *
      limit;


    const {
      rows,
      count
    } =
      await Order.findAndCountAll({

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
            model:
              OrderItem,

            as:
              "items",

            attributes: [
              "id",
              "product_id",
              "quantity",
              "unit_price",
              "line_total"
            ],

            include: [
              {
                model:
                  Product,

                as:
                  "product",

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
          [
            "createdAt",
            "DESC"
          ]
        ],

        limit,

        offset,

        distinct:
          true
      });


    return {

      orders:
        rows,

      pagination: {

        page,

        limit,

        totalItems:
          count,

        totalPages:
          Math.ceil(
            count / limit
          )
      }
    };
  }


  // ============================================================
  // ADMIN - UPDATE ORDER STATUS
  // ============================================================

  async updateOrderStatus(
    orderId,
    newStatus
  ) {

    const transaction =
      await sequelize.transaction();


    try {

      // Lock order while changing status
      const order =
        await Order.findByPk(
          orderId,
          {
            transaction,

            lock:
              transaction.LOCK.UPDATE
          }
        );


      if (!order) {

        const error =
          new Error(
            "Order not found"
          );

        error.statusCode =
          404;

        throw error;
      }


      // Allowed status transitions
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

        const error =
          new Error(
            `Cannot change order status from ${order.status} to ${newStatus}`
          );

        error.statusCode =
          409;

        throw error;
      }


      // Restore stock when order is cancelled
      if (
        newStatus ===
        "CANCELLED"
      ) {

        const orderItems =
          await OrderItem.findAll({
            where: {
              order_id:
                order.id
            },

            transaction
          });


        for (
          const orderItem
          of orderItems
        ) {

          const product =
            await Product.findByPk(
              orderItem.product_id,
              {
                transaction,

                lock:
                  transaction.LOCK.UPDATE
              }
            );


          if (!product) {

            const error =
              new Error(
                `Product not found for order item: ${orderItem.product_id}`
              );

            error.statusCode =
              404;

            throw error;
          }


          product.stock_quantity +=
            orderItem.quantity;


          await product.save({
            transaction
          });
        }
      }


      // Update order status
      order.status =
        newStatus;


      await order.save({
        transaction
      });


      await transaction.commit();


      return {

        id:
          order.id,

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
  }
}


module.exports = OrderService;