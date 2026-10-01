const productService =
  require("../services/product-service");

const {
  createProductSchema,
  productQuerySchema,
  updateProductSchema
} = require("../validations/product-validation");

const createProduct = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      createProductSchema.parse(
        req.body
      );

    const product =
      await productService.createProduct(
        validatedData
      );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};
const getProductById = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await productService.getProductById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};
const getProducts = async (
  req,
  res,
  next
) => {
  try {
    const validatedQuery =
      productQuerySchema.parse(
        req.query
      );

    const result =
      await productService.getProducts(
        validatedQuery
      );

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: result.products,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      updateProductSchema.parse(
        req.body
      );

    const product =
      await productService.updateProduct(
        req.params.id,
        validatedData
      );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};
const deleteProduct = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await productService.deleteProduct(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};