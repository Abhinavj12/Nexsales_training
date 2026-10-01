const { Model, DataTypes } = require("sequelize");
class Department extends Model {
    static initModel(sequelize) {
        Department.init(
            {
                id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    validate: { len: [2, 100] },
                    set(value) {
                        this.setDataValue("name", value.trim());
                    }
                },
                code: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    unique: true,
                    validate: { len: [2, 20] },
                    set(value) {
                        this.setDataValue("code", value.trim().toUpperCase());
                    }
                }
            },
            {
                sequelize,
                modelName: "Department",
                tableName: "departments",
                timestamps: true,
                underscored: true,
                paranoid: true
            }
        );
        return Department;
    }
    static associate(models) {
        Department.hasMany(models.Student, {
            foreignKey: "departmentId",
            as: "students",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
    }
}
module.exports = Department;
