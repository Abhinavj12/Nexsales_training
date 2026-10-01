const {
  Model,
  DataTypes
} = require("sequelize");

class PasswordResetToken extends Model {
  static initModel(sequelize) {
    PasswordResetToken.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },

        user_id: {
          type: DataTypes.UUID,
          allowNull: false
        },

        token_hash: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },

        expires_at: {
          type: DataTypes.DATE,
          allowNull: false
        },

        used_at: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: "PasswordResetToken",
        tableName: "password_reset_tokens",
        timestamps: true,
        underscored: true
      }
    );

    return PasswordResetToken;
  }

  static associate(models) {
    PasswordResetToken.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
  }
}

module.exports = PasswordResetToken;