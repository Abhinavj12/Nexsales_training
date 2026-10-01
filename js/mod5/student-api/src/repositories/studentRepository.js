import {db} from "../config/database.js";
import {students} from "../db/schema.js";
import {asc,eq} from "drizzle-orm";

export const getAllStudents=async()=>{
    return await db.select().from(students).orderBy(asc(students.id));
};

export const getStudentById=async(id)=>{
    const result=await db.select().from(students).where(eq(students.id,id)).limit(1);
    return result[0]??null;
};

export const createStudent=async(studentData)=>{
    const result =await db.insert(students).values(studentData).returning();
    return result[0];
}

export const updateStudent=async(id,studentData)=>{
    const result=await db.update(students).set(studentData).where(eq(students.id,id)).returning();
    return result[0]??null;
};

export const deleteStudent=async(id)=>{
    const result=await db.delete(students).where(eq(students.id,id)).returning();
    return result[0]??null;
};