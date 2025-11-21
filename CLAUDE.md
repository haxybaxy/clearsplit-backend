# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **ClearSplit** backend application built with NestJS, TypeScript, and TypeORM. It provides a RESTful API for managing expense splits, teams, transactions, and financial allocations. The application uses Supabase for authentication and PostgreSQL for data persistence.

## Development Commands

### Running the Application
```bash
npm run start:dev      # Development mode with hot-reload
npm run start          # Standard start
npm run start:prod     # Production mode (requires build first)
npm run build          # Build the application
```

### Testing
```bash
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage report
npm run test:e2e       # Run end-to-end tests
npm run test:debug     # Run tests with debugger attached
```

### Code Quality
```bash
npm run lint           # Run ESLint and auto-fix issues
npm run format         # Format code with Prettier
```

## Architecture

### Module Organization Pattern

The codebase follows a **domain-driven hexagonal architecture** with consistent module structure:

```
src/modules/<module-name>/
├── domain/                    # Business logic and value objects
│   └── *.value-object.ts
├── application/               # Application services and DTOs
│   ├── *.service.ts
│   └── dto/
│       └── *.dto.ts
├── infra/                     # Infrastructure layer
│   ├── repositories/          # Data access
│   │   ├── model/
│   │   │   └── *.entity.ts   # TypeORM entities
│   │   └── migrations/        # Database migrations
│   └── api/                   # HTTP layer
│       ├── guard/
│       ├── strategy/
│       └── dto/
├── controllers/               # HTTP controllers (some modules)
│   └── *.controller.ts
└── <module-name>.module.ts   # NestJS module definition
```

**Key architectural principles:**

1. **Layered separation**: Domain logic, application services, and infrastructure are clearly separated
2. **Repository pattern**: All database access goes through repositories in `infra/repositories/`
3. **DTOs with Zod**: Input validation uses Zod schemas defined as `*DtoSchema` with inferred types
4. **Base entities**: All TypeORM entities extend `DatabaseEntity` from `@base/infra/repositories/entities/typeorm/database.entity` which provides:
   - `id` (UUID primary key)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

### Path Aliases

The project uses TypeScript path aliases for clean imports:

- `@base/*` → `src/base/*` - Shared base classes and utilities
- `@modules/*` → `src/modules/*` - Feature modules
- `@src/*` → `src/*` - Source root
- `@config/*` → `src/config/*` - Configuration files

**Always use these aliases** instead of relative paths when importing across modules.

### Core Modules

- **auth** - Supabase authentication with JWT strategy
- **user** - User management and database sync
- **team** - Team creation and membership
- **transaction** - Financial transaction handling
- **split** - Expense splitting logic
- **contact** - Contact management
- **property** - Property/asset tracking
- **report** - Financial reporting
- **invoice-form** - Invoice generation
- **data-import** - Data import utilities
- **currency** - Currency management
- **recurring-expense** - Recurring expense handling
- **business-expense** - Business expense tracking
- **notification** - Notification system
- **database** - TypeORM configuration and setup

## Authentication System

### Supabase + JWT Authentication

The application uses a hybrid authentication approach:

1. **Supabase** handles user authentication (email/password, OAuth)
2. **PostgreSQL + TypeORM** stores user profile data
3. **Local JWT verification** validates tokens without external API calls
4. **Bearer tokens** are passed in `Authorization` header

### Environment Variables Required

```env
# Supabase Configuration
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=clearsplit
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_LOGGING_ENABLED=false

# Application
NODE_ENV=development
```

### Protecting Routes

To protect any controller or route, use the `JwtAuthGuard`:

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/infra/api/guard/jwt-auth.guard';

@Controller('example')
@UseGuards(JwtAuthGuard)  // Protect entire controller
export class ExampleController {
  @Get()
  async getData(@Request() req) {
    // Access authenticated user from req.user
    const userId = req.user.id;
    const userEmail = req.user.email;
    return { userId, userEmail };
  }
}
```

The `req.user` object contains: `id`, `supabaseId`, `email`, `firstName`, `lastName`, `avatarUrl`.

See `PROTECTED_ROUTE_EXAMPLE.md` for detailed examples.

## Database

### TypeORM Configuration

- **Database**: PostgreSQL
- **ORM**: TypeORM with repository pattern
- **Synchronize**: `false` (use migrations in production)
- **SSL**: Disabled in development, enabled with `rejectUnauthorized: false` in production
- **Entities**: Auto-loaded from `dist/modules/**/model/*.entity.js`
- **Migrations**: Located in `dist/modules/**/infra/repositories/migrations/*.js`

### Creating Entities

All entities must:
1. Extend `DatabaseEntity` from `@base/infra/repositories/entities/typeorm/database.entity`
2. Use the `@Entity()` decorator with a table name constant
3. Be placed in `src/modules/<module>/infra/repositories/model/*.entity.ts`

Example:
```typescript
import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity } from 'typeorm';

export const EXAMPLE_TABLE_NAME = 'example';

@Entity(EXAMPLE_TABLE_NAME)
export class DBExample extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;
}
```

### Naming Conventions

- **Entity classes**: Prefix with `DB` (e.g., `DBUser`, `DBTeam`, `DBTransaction`)
- **Table name constants**: `<NAME>_TABLE_NAME` in SCREAMING_SNAKE_CASE
- **Actual table names**: lowercase with underscores (e.g., `user`, `team_member`)

## Validation with Zod

Input validation uses **Zod schemas** instead of class-validator:

```typescript
import { z } from 'zod';

export const CreateExampleDtoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(0).optional(),
});

export type CreateExampleDto = z.infer<typeof CreateExampleDtoSchema>;
```

Controllers validate input using Zod schemas in the service layer or via a validation pipe.

## Testing Strategy

- **Unit tests**: Co-located with source files as `*.spec.ts`
- **E2E tests**: In `test/` directory
- **Test root**: `src/` (Jest configured with `rootDir: "src"`)
- **Coverage**: Reports generated in `coverage/` directory

When writing tests, mock external dependencies (Supabase, database) and test business logic in isolation.

## Common Patterns

### Creating a New Module

1. Create module directory: `src/modules/<module-name>/`
2. Set up architecture layers:
   - `domain/` - Value objects and business logic
   - `application/` - Services and DTOs
   - `infra/repositories/model/` - Entities
   - `controllers/` or `infra/api/` - HTTP layer
3. Create module file: `<module-name>.module.ts`
4. Import in `app.module.ts`

### Adding Database Relationships

Use TypeORM decorators (`@OneToMany`, `@ManyToOne`, `@OneToOne`, `@ManyToMany`) in entity files. Always define both sides of relationships for proper type safety.

### Service Dependencies

Services are injected via constructor. When a service needs database access:
1. Import `TypeOrmModule.forFeature([DBEntity])` in module
2. Inject repository with `@InjectRepository(DBEntity)`

## Important Notes

- **Port**: Application runs on port 3000 by default (see `main.ts`)
- **CORS**: Not configured by default - add `app.enableCors()` in `main.ts` if needed
- **Node version**: >= 20.0.0 required
- **NPM version**: >= 10.0.0 required
- **Hot reload**: Available in development mode with `npm run start:dev`
- **Migrations**: Must be run manually - `synchronize` is disabled in production
