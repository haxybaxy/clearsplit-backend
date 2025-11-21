# ClearSplit Backend

A NestJS backend application for managing expense splits, teams, transactions, and financial allocations. Built with TypeScript, TypeORM, and Supabase.

## Description

This backend provides a RESTful API for the ClearSplit application, handling:
- Expense splitting and allocation
- Team and contact management
- Transaction tracking
- Financial reporting
- User authentication with Supabase

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL database (via Supabase)

## Project Setup

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_HOST=your-supabase-host
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your-database-password
DATABASE_NAME=postgres
DATABASE_LOGGING_ENABLED=true
NODE_ENV=development
PORT=3000

# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

Get your Supabase credentials from:
- Project Settings → Database (for database credentials)
- Project Settings → API (for service role key and JWT secret)

## Database Migrations

This project uses TypeORM migrations to manage database schema changes.

### Generate a New Migration

Compares your TypeORM entities with the current database schema and creates a migration file:

```bash
npm run migration:generate -- src/modules/database/infra/repositories/migrations/MigrationName
```

Example:
```bash
npm run migration:generate -- src/modules/database/infra/repositories/migrations/InitialSchema
```

### Run Migrations

Apply pending migrations to your database:

```bash
npm run migration:run
```

### Revert Last Migration

Rollback the most recent migration:

```bash
npm run migration:revert
```

### View Migration Status

See which migrations have been applied:

```bash
npm run migration:show
```

## Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Standard start
npm run start

# Production mode (requires build first)
npm run start:prod

# Build the application
npm run build
```

The API will be available at `http://localhost:3000` (or the port specified in your `.env` file).

## API Documentation

Interactive Swagger documentation is available at:
```
http://localhost:3000/api/docs
```

## Testing

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# Test coverage report
npm run test:cov

# End-to-end tests
npm run test:e2e

# Tests with debugger
npm run test:debug
```

## Code Quality

```bash
# Run ESLint and auto-fix issues
npm run lint

# Format code with Prettier
npm run format
```

## Project Structure

```
src/
├── base/                      # Shared base classes and utilities
├── config/                    # Configuration files
│   └── db/                   # Database configuration
├── modules/                   # Feature modules
│   ├── auth/                 # Authentication (Supabase + JWT)
│   ├── user/                 # User management
│   ├── team/                 # Team management
│   ├── transaction/          # Transaction handling
│   ├── split/                # Expense splitting
│   ├── contact/              # Contact management
│   ├── property/             # Property tracking
│   └── ...                   # Other modules
└── main.ts                   # Application entry point
```

Each module follows a domain-driven hexagonal architecture:
- `domain/` - Business logic and value objects
- `application/` - Services and DTOs
- `infra/` - Infrastructure (repositories, API controllers)

## Technology Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **ORM**: TypeORM 0.3
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase + Passport JWT
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## License

MIT
