import {
    asc,
    eq
} from "drizzle-orm";

import { db }
    from "../config/database.js";

import { students }
    from "../db/schema.js";

export const findAll = async () => {
    const studentList = await db
        .select()
        .from(students)
        .orderBy(asc(students.id));

    return studentList;
};

export const findById = async id => {
    const result = await db
        .select()
        .from(students)
        .where(eq(students.id, id))
        .limit(1);

    const [student] = result;

    return student;
};

export const findByEmail = async email => {
    const result = await db
        .select()
        .from(students)
        .where(eq(students.email, email))
        .limit(1);

    const [student] = result;

    return student;
};

export const create = async studentData => {
    const result = await db
        .insert(students)
        .values({
            firstName:
                studentData.firstName.trim(),

            lastName:
                studentData.lastName.trim(),

            email:
                studentData.email
                    .trim()
                    .toLowerCase(),

            age:
                Number(studentData.age)
        })
        .returning();

    const [createdStudent] = result;

    return createdStudent;
};

export const updateById = async (
    id,
    studentData
) => {
    const updatedValues = {};

    if (studentData.firstName !== undefined) {
        updatedValues.firstName =
            studentData.firstName.trim();
    }

    if (studentData.lastName !== undefined) {
        updatedValues.lastName =
            studentData.lastName.trim();
    }

    if (studentData.email !== undefined) {
        updatedValues.email =
            studentData.email
                .trim()
                .toLowerCase();
    }

    if (studentData.age !== undefined) {
        updatedValues.age =
            Number(studentData.age);
    }

    updatedValues.updatedAt = new Date();

    const result = await db
        .update(students)
        .set(updatedValues)
        .where(eq(students.id, id))
        .returning();

    const [updatedStudent] = result;

    return updatedStudent;
};

export const deleteById = async id => {
    const result = await db
        .delete(students)
        .where(eq(students.id, id))
        .returning();

    const [deletedStudent] = result;

    return deletedStudent;
};