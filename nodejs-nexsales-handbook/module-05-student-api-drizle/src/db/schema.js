import {
    integer,
    pgTable,
    serial,
    timestamp,
    varchar
} from "drizzle-orm/pg-core";

export const students = pgTable(
    "students",
    {
        id: serial("id")
            .primaryKey(),

        firstName: varchar(
            "first_name",
            { length: 100 }
        )
            .notNull(),

        lastName: varchar(
            "last_name",
            { length: 100 }
        )
            .notNull(),

        email: varchar(
            "email",
            { length: 255 }
        )
            .notNull()
            .unique(),

        age: integer("age")
            .notNull(),

        createdAt: timestamp(
            "created_at",
            {
                withTimezone: true
            }
        )
            .defaultNow()
            .notNull(),

        updatedAt: timestamp(
            "updated_at",
            {
                withTimezone: true
            }
        )
            .defaultNow()
            .notNull()
    }
);