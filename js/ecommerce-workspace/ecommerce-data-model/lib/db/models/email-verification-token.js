const {
  Model,
  DataTypes
} = require("sequelize");

class EmailVerificationToken extends Model {
  static initModel(sequelize) {
    EmailVerificationToken.init(
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
          type: DataTypes.STRING(64),
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
        modelName: "EmailVerificationToken",
        tableName: "email_verification_tokens",

        timestamps: true,
        underscored: true
      }
    );

    return EmailVerificationToken;
  }

  static associate(models) {
    EmailVerificationToken.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
  }
}

module.exports = EmailVerificationToken;