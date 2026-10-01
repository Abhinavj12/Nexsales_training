const {
  Category,
  Product
} = require("@ecommerce/ecommerce-data-model");

const createCategory = async (data) => {
  const existingCategory =
    await Category.findOne({
      where: {
        name: data.name
      }
    });

  if (existingCategory) {
    const error = new Error(
      "A category with this name already exists"
    );

    error.statusCode = 409;

    throw error;
  }

  const category =
    await Category.create({
      name: data.name,
      description: data.description,
      status: data.status
    });

  return {
    id: category.id,
    name: category.name,
    description: category.description,
    status: category.status,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  };
};
const getCategories = async () => {
  const categories = await Category.findAll({
    where: {
      status: ["ACTIVE","INACTIVE"]
    },
    attributes: [
      "id",
      "name",
      "description",
      "status",
      "created_at",
      "updated_at"
    ],
    order: [
      ["name", "ASC"]
    ]
  });

  return categories;
};
const getCategoryById = async (categoryId) => {
  const category = await Category.findOne({
    where: {
      id: categoryId,
      status: "ACTIVE"
    },
    attributes: [
      "id",
      "name",
      "description",
      "status",
      "createdAt",
      "updatedAt"
    ]
  });

  if (!category) {
    const error = new Error(
      "Category not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return category;
};
const updateCategory = async (
  categoryId,
  data
) => {
  const category =
    await Category.findByPk(categoryId);

  if (!category) {
    const error = new Error(
      "Category not found"
    );

    error.statusCode = 404;

    throw error;
  }

  if (data.name) {
    const existingCategory =
      await Category.findOne({
        where: {
          name: data.name
        }
      });

    if (
      existingCategory &&
      existingCategory.id !== category.id
    ) {
      const error = new Error(
        "A category with this name already exists"
      );

      error.statusCode = 409;

      throw error;
    }
  }

  if (data.name !== undefined) {
    category.name = data.name;
  }

  if (data.description !== undefined) {
    category.description =
      data.description;
  }

  if (data.status !== undefined) {
    category.status = data.status;
  }

  await category.save();

  return {
    id: category.id,
    name: category.name,
    description: category.description,
    status: category.status,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  };
};
const deleteCategory = async (categoryId) => {
  const category =
    await Category.findByPk(categoryId);

  if (!category) {
    const error = new Error(
      "Category not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const productCount =
    await Product.count({
      where: {
        category_id: categoryId
      }
    });

  if (productCount > 0) {
    const error = new Error(
      "Category cannot be deleted because products are associated with it. Set the category to INACTIVE instead."
    );

    error.statusCode = 409;

    throw error;
  }

  await category.destroy();

  return {
    id: category.id
  };
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};