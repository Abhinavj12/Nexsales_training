const CategoryService =
  require("../services/category-service");

const {
  createCategorySchema,
  updateCategorySchema
} = require("../validations/category-validation");


class CategoryController {

  constructor() {
    // Create service instance
    this.service = new CategoryService();
  }


  async createCategory(
    req,
    res,
    next
  ) {

    try {

      const validatedData =
        createCategorySchema.parse(
          req.body
        );

      const category =
        await this.service.createCategory(
          validatedData
        );

      return res.status(201).json({
        success: true,
        message:
          "Category created successfully",
        data: category
      });

    } catch (error) {
      next(error);
    }
  }


  async getCategories(
    req,
    res,
    next
  ) {

    try {

      const categories =
        await this.service.getCategories();

      return res.status(200).json({
        success: true,
        message:
          "Categories retrieved successfully",
        data: categories
      });

    } catch (error) {
      next(error);
    }
  }


  async getCategoryById(
    req,
    res,
    next
  ) {

    try {

      const category =
        await this.service.getCategoryById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          "Category retrieved successfully",
        data: category
      });

    } catch (error) {
      next(error);
    }
  }


  async updateCategory(
    req,
    res,
    next
  ) {

    try {

      const validatedData =
        updateCategorySchema.parse(
          req.body
        );

      const category =
        await this.service.updateCategory(
          req.params.id,
          validatedData
        );

      return res.status(200).json({
        success: true,
        message:
          "Category updated successfully",
        data: category
      });

    } catch (error) {
      next(error);
    }
  }


  async deleteCategory(
    req,
    res,
    next
  ) {

    try {

      const result =
        await this.service.deleteCategory(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          "Category deleted successfully",
        data: result
      });

    } catch (error) {
      next(error);
    }
  }
}


module.exports = CategoryController;