# Simple Training Management Platform

This version keeps the original API/data-model layout, class controllers and services, Sequelize migrations, and centralized JSON routing. It intentionally excludes Swagger, Winston, Convict, JWT, npm workspaces, cloud-build files, Postman files, environment-specific settings files, and message catalogues.

## Setup

```powershell
cd C:\SwabhavDrive\nodejs-nexsales\training-management-platform-simple
Copy-Item .env.example .env
# Edit the database password, then create training_management_simple_db in PostgreSQL.
npm.cmd run install:all
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

Routes are declared in `training-management-api/app/configs/route.config.json`. The loader dynamically creates each controller once, resolves named middleware, binds controller methods, and registers all endpoints. Database schema changes use migrations only; `sequelize.sync()` is not used.

Available APIs are `/api/v1/health`, Department CRUD/restore/student-list routes, and Student CRUD/restore routes. Collection endpoints accept `page` and `pageSize`.
