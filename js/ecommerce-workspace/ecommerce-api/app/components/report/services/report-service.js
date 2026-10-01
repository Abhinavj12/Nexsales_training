const PDFDocument = require("pdfkit");

const {
  createObjectCsvStringifier
} = require("csv-writer");

const {
  Order,
  OrderItem,
  Payment
} = require("@ecommerce/ecommerce-data-model");


const getOrderHistory = async (userId) => {
  const orders = await Order.findAll({
    where: {
      user_id: userId
    },

    attributes: [
      "id",
      "status",
      "total_amount",
      "createdAt"
    ],

    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: [
          "id",
          "quantity"
        ]
      },

      {
        model: Payment,
        as: "payments",
        attributes: [
          "id",
          "status",
          "createdAt"
        ],

        required: false,

        order: [
          ["createdAt", "DESC"]
        ]
      }
    ],

    order: [
      ["createdAt", "DESC"]
    ]
  });

  return orders.map((order) => {
    const data = order.toJSON();

    const numberOfItems =
      (data.items || []).reduce(
        (total, item) =>
          total + Number(item.quantity),
        0
      );

    const payments =
      data.payments || [];

    const latestPayment =
      payments.length > 0
        ? payments[0]
        : null;

    return {
      orderId: data.id,

      orderDate: data.createdAt,

      numberOfItems,

      totalAmount:
        data.total_amount,

      paymentStatus:
        latestPayment
          ? latestPayment.status
          : "NOT_CREATED",

      orderStatus:
        data.status
    };
  });
};


/*
 * Generate Order History PDF
 */
const generateOrderHistoryPdf = async (
  userId,
  res
) => {
  const orders =
    await getOrderHistory(userId);

  const doc =
    new PDFDocument({
      margin: 40
    });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="order-history.pdf"'
  );

  doc.pipe(res);

  doc
    .fontSize(20)
    .text(
      "Order History",
      {
        align: "center"
      }
    );

  doc.moveDown();

  if (orders.length === 0) {
    doc
      .fontSize(12)
      .text(
        "No orders found."
      );

    doc.end();

    return;
  }

  orders.forEach(
    (order, index) => {
      doc
        .fontSize(12)
        .text(
          `Order ${index + 1}`
        );

      doc
        .fontSize(10)
        .text(
          `Order ID: ${order.orderId}`
        );

      doc.text(
        `Order Date: ${new Date(
          order.orderDate
        ).toLocaleString()}`
      );

      doc.text(
        `Number of Items: ${order.numberOfItems}`
      );

      doc.text(
        `Total Amount: ₹${order.totalAmount}`
      );

      doc.text(
        `Payment Status: ${order.paymentStatus}`
      );

      doc.text(
        `Order Status: ${order.orderStatus}`
      );

      doc.moveDown();

      doc
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .stroke();

      doc.moveDown();
    }
  );

  doc.end();
};


/*
 * Generate Order History CSV
 */
const generateOrderHistoryCsv = async (
  userId,
  res
) => {
  const orders =
    await getOrderHistory(userId);

  const csvStringifier =
    createObjectCsvStringifier({
      header: [
        {
          id: "orderId",
          title: "Order ID"
        },

        {
          id: "orderDate",
          title: "Order Date"
        },

        {
          id: "numberOfItems",
          title: "Number of Items"
        },

        {
          id: "totalAmount",
          title: "Total Amount"
        },

        {
          id: "paymentStatus",
          title: "Payment Status"
        },

        {
          id: "orderStatus",
          title: "Order Status"
        }
      ]
    });

  const csv =
    csvStringifier.getHeaderString() +
    csvStringifier.stringifyRecords(
      orders
    );

  res.setHeader(
    "Content-Type",
    "text/csv; charset=utf-8"
  );

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="order-history.csv"'
  );

  return res
    .status(200)
    .send(csv);
};
const getAllOrderHistory = async () => {
  const orders = await Order.findAll({
    attributes: [
      "id",
      "status",
      "total_amount",
      "createdAt"
    ],

    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: [
          "id",
          "quantity"
        ]
      },
      {
        model: Payment,
        as: "payments",
        attributes: [
          "id",
          "status",
          "createdAt"
        ],
        required: false
      }
    ],

    order: [
      ["createdAt", "DESC"]
    ]
  });

  return orders.map((order) => {
    const data = order.toJSON();

    const numberOfItems =
      (data.items || []).reduce(
        (total, item) =>
          total + Number(item.quantity),
        0
      );

    const payments =
      data.payments || [];

    const latestPayment =
      payments.length > 0
        ? payments[0]
        : null;

    return {
      orderId: data.id,
      orderDate: data.createdAt,
      numberOfItems,
      totalAmount: data.total_amount,
      paymentStatus:
        latestPayment
          ? latestPayment.status
          : "NOT_CREATED",
      orderStatus: data.status
    };
  });
};
const generateAdminOrderHistoryPdf =
  async (res) => {
    const orders =
      await getAllOrderHistory();

    const doc =
      new PDFDocument({
        margin: 40
      });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="admin-order-history.pdf"'
    );

    doc.pipe(res);

    doc
      .fontSize(20)
      .text(
        "Admin Order History",
        {
          align: "center"
        }
      );

    doc.moveDown();

    if (orders.length === 0) {
      doc
        .fontSize(12)
        .text("No orders found.");

      doc.end();

      return;
    }

    orders.forEach(
      (order, index) => {
        doc
          .fontSize(12)
          .text(
            `Order ${index + 1}`
          );

        doc
          .fontSize(10)
          .text(
            `Order ID: ${order.orderId}`
          );

        doc.text(
          `Order Date: ${new Date(
            order.orderDate
          ).toLocaleString()}`
        );

        doc.text(
          `Number of Items: ${order.numberOfItems}`
        );

        doc.text(
          `Total Amount: ₹${order.totalAmount}`
        );

        doc.text(
          `Payment Status: ${order.paymentStatus}`
        );

        doc.text(
          `Order Status: ${order.orderStatus}`
        );

        doc.moveDown();

        doc
          .moveTo(40, doc.y)
          .lineTo(555, doc.y)
          .stroke();

        doc.moveDown();
      }
    );

    doc.end();
  };
  const generateAdminOrderHistoryCsv =
  async (res) => {
    const orders =
      await getAllOrderHistory();

    const csvStringifier =
      createObjectCsvStringifier({
        header: [
          {
            id: "orderId",
            title: "Order ID"
          },
          {
            id: "orderDate",
            title: "Order Date"
          },
          {
            id: "numberOfItems",
            title: "Number of Items"
          },
          {
            id: "totalAmount",
            title: "Total Amount"
          },
          {
            id: "paymentStatus",
            title: "Payment Status"
          },
          {
            id: "orderStatus",
            title: "Order Status"
          }
        ]
      });

    const csv =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(
        orders
      );

    res.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="admin-order-history.csv"'
    );

    return res
      .status(200)
      .send(csv);
  };

module.exports = {
  generateOrderHistoryPdf,
  generateOrderHistoryCsv,
  getAllOrderHistory,
  generateAdminOrderHistoryPdf,
  generateAdminOrderHistoryCsv

};