const ProductService =
  require("../services/product-service");

const {
  createProductSchema,
  productQuerySchema,
  updateProductSchema
} = require("../validations/product-validation");


class ProductController {

  constructor() {
    // Product business logic is handled by ProductService
    this.service = new ProductService();
  }


  async createProduct(
    req,
    res,
    next
  ) {

    try {

      const validatedData =
        createProductSchema.parse(
          req.body
        );

      const product =
        await this.service.createProduct(
          validatedData
        );

      return res.status(201).json({
        success: true,
        message:
          "Product created successfully",
        data: product
      });

    } catch (error) {
      next(error);
    }
  }


  async getProducts(
    req,
    res,
    next
  ) {

    try {

      const validatedQuery =
        productQuerySchema.parse(
          req.query
        );

      const result =
        await this.service.getProducts(
          validatedQuery
        );

      return res.status(200).json({
        success: true,
        message:
          "Products retrieved successfully",
        data: result.products,
        pagination: result.pagination
      });

    } catch (error) {
      next(error);
    }
  }


  async getProductById(
    req,
    res,
    next
  ) {

    try {

      const product =
        await this.service.getProductById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          "Product retrieved successfully",
        data: product
      });

    } catch (error) {
      next(error);
      
    }
  }


  async updateProduct(
    req,
    res,
    next
  ) {

    try {

      const validatedData =
        updateProductSchema.parse(
          req.body
        );

      const product =
        await this.service.updateProduct(
          req.params.id,
          validatedData
        );

      return res.status(200).json({
        success: true,
        message:
          "Product updated successfully",
        data: product
      });

    } catch (error) {
      next(error);
    }
  }


  async deleteProduct(
    req,
    res,
    next
  ) {

    try {

      const result =
        await this.service.deleteProduct(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          "Product deleted successfully",
        data: result
      });

    } catch (error) {
      next(error);
    }
  }
}


module.exports = ProductController;