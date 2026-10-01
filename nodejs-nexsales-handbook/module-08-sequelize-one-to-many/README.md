# Sequelize One-to-Many: Departments and Students

## Project overview

This beginner-friendly Node.js API demonstrates a Sequelize one-to-many relationship with PostgreSQL. A department can contain many students, while each student belongs to exactly one department.

## Folder structure

```text
module-08-sequelize-one-to-many/
├── src/
│   ├── config/database.js
│   ├── controllers/
│   │   ├── department.controller.js
│   │   └── student.controller.js
│   ├── models/
│   │   ├── department.model.js
│   │   ├── student.model.js
│   │   └── index.js
│   ├── routes/
│   │   ├── department.routes.js
│   │   └── student.routes.js
│   ├── utils/parseId.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## Installation

Use the latest Node.js LTS release, then run:

```bash
cd module-08-sequelize-one-to-many
npm install
```

Copy `.env.example` to `.env` and enter your PostgreSQL credentials.

## Database setup

Create the database before starting the API:

```sql
CREATE DATABASE student_department_db;
```

Sequelize connects using `.env` and runs `sequelize.sync({ alter: true })`, which creates or adjusts the `departments` and `students` tables. This is convenient for learning; production applications normally use migrations.

## Run commands

```bash
npm run dev
npm start
```

The default address is `http://localhost:3000`.

## API list and Postman test data

Set a Postman environment variable named `baseUrl` to `http://localhost:3000`.

### Root

```http
GET {{baseUrl}}/
```

### Create a department

```http
POST {{baseUrl}}/api/departments
Content-Type: application/json

{
    "name": "Computer Science",
    "description": "Software and computing studies"
}
```

### Get all departments

```http
GET {{baseUrl}}/api/departments
```

### Get one department

```http
GET {{baseUrl}}/api/departments/1
```

### Update a department

```http
PATCH {{baseUrl}}/api/departments/1
Content-Type: application/json

{
    "description": "Programming, systems, and data studies"
}
```

### Delete a department

```http
DELETE {{baseUrl}}/api/departments/1
```

This returns `409 Conflict` if the department still has students.

### Create a student

Create the referenced department first.

```http
POST {{baseUrl}}/api/students
Content-Type: application/json

{
    "firstName": "Asha",
    "lastName": "Patel",
    "email": "asha.patel@example.com",
    "age": 20,
    "departmentId": 1
}
```

### Get all students

```http
GET {{baseUrl}}/api/students
```

### Get one student

```http
GET {{baseUrl}}/api/students/1
```

### Update a student

```http
PATCH {{baseUrl}}/api/students/1
Content-Type: application/json

{
    "age": 21,
    "departmentId": 2
}
```

Department `2` must already exist.

### Delete a student

```http
DELETE {{baseUrl}}/api/students/1
```

## Relationship explanation

`Department.hasMany(Student, { as: "students" })` describes the parent side. Eager-loading a department with `include` therefore returns `students` as an array—even when it is empty—because zero, one, or many students may belong to the department.

`Student.belongsTo(Department, { as: "department" })` describes the child side. The `departmentId` property is stored in PostgreSQL as `department_id`; it is the foreign key that points to `departments.id`. Eager-loading a student returns one `department` object.

`onUpdate: "CASCADE"` keeps the foreign key aligned if a department primary key changes. `onDelete: "RESTRICT"` protects student records from pointing to a deleted department. The controller also checks for students first so clients receive a helpful `409` response rather than relying only on the database error.

## Example responses

A department with its has-many array:

```json
{
    "id": 1,
    "name": "Computer Science",
    "description": "Software and computing studies",
    "createdAt": "2026-07-29T10:00:00.000Z",
    "updatedAt": "2026-07-29T10:00:00.000Z",
    "students": [
        {
            "id": 1,
            "firstName": "Asha",
            "lastName": "Patel",
            "email": "asha.patel@example.com",
            "age": 20,
            "departmentId": 1,
            "createdAt": "2026-07-29T10:05:00.000Z",
            "updatedAt": "2026-07-29T10:05:00.000Z"
        }
    ]
}
```

A student with its belongs-to object:

```json
{
    "id": 1,
    "firstName": "Asha",
    "lastName": "Patel",
    "email": "asha.patel@example.com",
    "age": 20,
    "departmentId": 1,
    "createdAt": "2026-07-29T10:05:00.000Z",
    "updatedAt": "2026-07-29T10:05:00.000Z",
    "department": {
        "id": 1,
        "name": "Computer Science",
        "description": "Software and computing studies",
        "createdAt": "2026-07-29T10:00:00.000Z",
        "updatedAt": "2026-07-29T10:00:00.000Z"
    }
}
```

## One-to-One versus One-to-Many

In a one-to-one relationship, each parent is associated with at most one child, and the foreign key is normally unique. For example, one user has one profile.

In a one-to-many relationship, one parent may be referenced by multiple child rows. Here, many students can share the same `department_id`, so that foreign key is intentionally not unique. Each individual student still belongs to only one department.
