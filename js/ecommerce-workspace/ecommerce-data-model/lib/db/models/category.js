const { Model, DataTypes } = require("sequelize");

class Category extends Model {
  static initModel(sequelize) {
    Category.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },

        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Category name is required"
            },

            len: {
              args: [2, 100],
              msg: "Category name must be between 2 and 100 characters"
            }
          },

          set(value) {
            this.setDataValue("name", value.trim());
          }
        },

        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },

        status: {
          type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
          allowNull: false,
          defaultValue: "ACTIVE"
        },

        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: "Category",
        tableName: "categories",
        timestamps: true,
        paranoid: true,
        underscored: true
      }
    );

    return Category;
  }

  static associate(models) {
  Category.hasMany(models.Product, {
    foreignKey: "category_id",
    as: "products"
  });
}
}

module.exports = Category;