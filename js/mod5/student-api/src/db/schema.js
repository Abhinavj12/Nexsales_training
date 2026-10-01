import{
    pgTable,
    serial,
    varchar,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";
 export const students=pgTable("students",{
    id:serial("id").primaryKey(),
    firstName:varchar("firtName",{length:50}).notNull(),
    lastName:varchar("lastName",{length:50}).notNull(),
    email:varchar("email",{length:100}).notNull().unique(),
    age:integer("age"),
    course:varchar("course",{length:100}),
    createdAt:timestamp("createdAt",{withTimezone:true}).defaultNow().notNull(),
    updatedAt:timestamp("updatedAt",{withTimezone:true}).defaultNow().notNull()
 });
