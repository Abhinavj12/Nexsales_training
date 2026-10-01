import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

const Student = sequelize.define(
    "Student",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "first_name",

            validate: {
                notEmpty: {
                    msg:
                        "First name cannot be empty"
                },

                len: {
                    args: [2, 50],
                    msg:
                        "First name must contain between 2 and 50 characters"
                }
            }
        },

        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "last_name",

            validate: {
                notEmpty: {
                    msg:
                        "Last name cannot be empty"
                },

                len: {
                    args: [2, 50],
                    msg:
                        "Last name must contain between 2 and 50 characters"
                }
            }
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,

            validate: {
                isEmail: {
                    msg:
                        "Enter a valid email address"
                }
            }
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: false,

            validate: {
                isInt: {
                    msg:
                        "Age must be an integer"
                },

                min: {
                    args: [1],
                    msg:
                        "Age must be at least 1"
                },

                max: {
                    args: [120],
                    msg:
                        "Age cannot exceed 120"
                }
            }
        }
    },
    {
        tableName: "students",

        timestamps: true,

        underscored: true
    }
);

export default Student;
