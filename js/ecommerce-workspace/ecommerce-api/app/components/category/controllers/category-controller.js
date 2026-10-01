const categoryService =
  require("../services/category-service");

const {
  createCategorySchema,
  updateCategorySchema
} = require("../validations/category-validation");

const createCategory = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      createCategorySchema.parse(
        req.body
      );

    const category =
      await categoryService.createCategory(
        validatedData
      );

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    next(error);
  }
};
const getCategories = async (
  req,
  res,
  next
) => {
  try {
    const categories =
      await categoryService.getCategories();

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
const getCategoryById = async (
  req,
  res,
  next
) => {
  try {
    const category =
      await categoryService.getCategoryById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category
    });
  } catch (error) {
    next(error);
  }
};
const updateCategory = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      updateCategorySchema.parse(
        req.body
      );

    const category =
      await categoryService.updateCategory(
        req.params.id,
        validatedData
      );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await categoryService.deleteCategory(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
  
};