const {
  Product,
  Category,
  ProductImage,
  Sequelize
} = require("@ecommerce/ecommerce-data-model");

const { Op } = Sequelize;


// ============================================================
// CREATE PRODUCT
// ============================================================

const createProduct = async (data) => {
  // 1. Check category
  const category =
    await Category.findOne({
      where: {
        id: data.category_id,
        status: "ACTIVE"
      }
    });

  if (!category) {
    const error = new Error(
      "Active category not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // 2. Check SKU
  const existingProduct =
    await Product.findOne({
      where: {
        sku: data.sku
      }
    });

  if (existingProduct) {
    const error = new Error(
      "A product with this SKU already exists"
    );

    error.statusCode = 409;

    throw error;
  }

  // 3. Create product
  const product =
    await Product.create({
      sku: data.sku,
      name: data.name,
      description: data.description,
      category_id: data.category_id,
      price: data.price,
      stock_quantity: data.stock_quantity,
      status: data.status
    });

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    category_id: product.category_id,
    price: product.price,
    stock_quantity: product.stock_quantity,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
};


// ============================================================
// GET PRODUCTS
// Search + Filter + Sort + Pagination
// ============================================================

const getProducts = async (query) => {
  const {
    search,
    category_id,
    min_price,
    max_price,
    sort_by,
    sort_order,
    page,
    limit
  } = query;

  const where = {
    status: "ACTIVE"
  };

  // Search by product name or SKU
  if (search) {
    where[Op.or] = [
      {
        name: {
          [Op.iLike]: `%${search}%`
        }
      },
      {
        sku: {
          [Op.iLike]: `%${search}%`
        }
      }
    ];
  }

  // Category filter
  if (category_id) {
    where.category_id = category_id;
  }

  // Price filter
  if (
    min_price !== undefined ||
    max_price !== undefined
  ) {
    where.price = {};

    if (min_price !== undefined) {
      where.price[Op.gte] = min_price;
    }

    if (max_price !== undefined) {
      where.price[Op.lte] = max_price;
    }
  }

  // Pagination
  const offset =
    (page - 1) * limit;

  const {
    rows,
    count
  } = await Product.findAndCountAll({
    where,

    distinct: true,

    attributes: [
      "id",
      "sku",
      "name",
      "description",
      "category_id",
      "price",
      "stock_quantity",
      "status",
      "createdAt",
      "updatedAt"
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
    ],

    order: [
      [sort_by, sort_order]
    ],

    limit,
    offset
  });

  return {
    products: rows,

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


// ============================================================
// GET PRODUCT BY ID
// ============================================================

const getProductById = async (
  productId
) => {
  const product =
    await Product.findOne({
      where: {
        id: productId,
        status: "ACTIVE"
      },

      attributes: [
        "id",
        "sku",
        "name",
        "description",
        "category_id",
        "price",
        "stock_quantity",
        "status",
        "createdAt",
        "updatedAt"
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
      ],

      order: [
        [
          "images",
          "sort_order",
          "ASC"
        ]
      ]
    });

  if (!product) {
    const error = new Error(
      "Product not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return product;
};


// ============================================================
// UPDATE PRODUCT
// ============================================================

const updateProduct = async (
  productId,
  data
) => {
  const product =
    await Product.findByPk(
      productId
    );

  if (!product) {
    const error = new Error(
      "Product not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // If category is being changed,
  // make sure the new category is active.
  if (
    data.category_id !== undefined
  ) {
    const category =
      await Category.findOne({
        where: {
          id: data.category_id,
          status: "ACTIVE"
        }
      });

    if (!category) {
      const error = new Error(
        "Active category not found"
      );

      error.statusCode = 404;

      throw error;
    }

    product.category_id =
      data.category_id;
  }

  if (data.name !== undefined) {
    product.name = data.name;
  }

  if (
    data.description !== undefined
  ) {
    product.description =
      data.description;
  }

  if (data.price !== undefined) {
    product.price = data.price;
  }

  if (
    data.stock_quantity !== undefined
  ) {
    product.stock_quantity =
      data.stock_quantity;
  }

  if (data.status !== undefined) {
    product.status =
      data.status;
  }

  await product.save();

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    category_id: product.category_id,
    price: product.price,
    stock_quantity:
      product.stock_quantity,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
};


// ============================================================
// DELETE PRODUCT
// Soft delete because Product uses paranoid: true
// ============================================================

const deleteProduct = async (
  productId
) => {
  const product =
    await Product.findByPk(
      productId
    );

  if (!product) {
    const error = new Error(
      "Product not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await product.destroy();

  return {
    id: product.id
  };
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};