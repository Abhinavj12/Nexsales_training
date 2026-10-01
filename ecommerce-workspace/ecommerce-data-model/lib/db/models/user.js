const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },

        first_name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "First name is required"
            },

            len: {
              args: [2, 50],
              msg: "First name must be between 2 and 50 characters"
            },

            isLettersOnly(value) {
              if (!/^[A-Za-z]+$/.test(value)) {
                throw new Error(
                  "First name must contain letters only"
                );
              }
            }
          },

          set(value) {
            this.setDataValue("first_name", value.trim());
          }
        },

        last_name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Last name is required"
            },

            len: {
              args: [2, 50],
              msg: "Last name must be between 2 and 50 characters"
            },

            isLettersOnly(value) {
              if (!/^[A-Za-z]+$/.test(value)) {
                throw new Error(
                  "Last name must contain letters only"
                );
              }
            }
          },

          set(value) {
            this.setDataValue("last_name", value.trim());
          }
        },

        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,

          validate: {
            isEmail: {
              msg: "Please provide a valid email address"
            }
          },

          set(value) {
            this.setDataValue(
              "email",
              value.trim().toLowerCase()
            );
          }
        },

        password_hash: {
          type: DataTypes.STRING,
          allowNull: false
        },

        role: {
          type: DataTypes.ENUM("USER", "ADMIN"),
          allowNull: false,
          defaultValue: "USER"
        },

        is_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },

        is_blocked: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },

        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },

      {
        sequelize,
        modelName: "User",
        tableName: "users",

        timestamps: true,
        paranoid: true,
        underscored: true
      }
    );

    return User;
  }

  static associate(models) {
  User.hasOne(models.Cart, {
    foreignKey: "user_id",
    as: "cart"
  });

  User.hasMany(models.Order, {
    foreignKey: "user_id",
    as: "orders"
  });

  User.hasMany(models.EmailVerificationToken, {
  foreignKey: "user_id",
  as: "emailVerificationTokens"
});
User.hasMany(models.PasswordResetToken, {
  foreignKey: "user_id",
  as: "passwordResetTokens"
});
}
}

module.exports = User;