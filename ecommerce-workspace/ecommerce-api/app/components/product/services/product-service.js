const {
  Product,
  Category,
  ProductImage,
  Sequelize
} = require("@ecommerce/ecommerce-data-model");

const { Op } = Sequelize;


class ProductService {

  // Create a new product
  async createProduct(data) {

    // Check whether category exists and is active
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

    // Check whether SKU already exists
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

    // Create product
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
  }


  // Get products with search, filters, sorting and pagination
  async getProducts(query) {

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

    // Filter by category
    if (category_id) {
      where.category_id = category_id;
    }

    // Filter by price range
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

    // Calculate pagination offset
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
  }


  // Get one active product by ID
  async getProductById(productId) {

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
  }


  // Update an existing product
  async updateProduct(
    productId,
    data
  ) {

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

    // If category is changed,
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
  }


  // Soft delete product
  async deleteProduct(productId) {

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
  }
}


module.exports = ProductService;