CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"firtName" varchar(50) NOT NULL,
	"lastName" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"age" integer,
	"course" varchar(100),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_email_unique" UNIQUE("email")
);
