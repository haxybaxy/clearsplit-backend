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
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
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

**Note**: This backend uses the Supabase service role key (not anon key) since it's a private API without Row Level Security policies. The service role key provides admin privileges and should never be exposed to clients or committed to version control.

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

## Swagger/OpenAPI Documentation

### Overview

The API is fully documented with **Swagger/OpenAPI** specification. Interactive documentation is available at:
- **URL**: http://localhost:3000/api/docs
- **Configuration**: `src/main.ts`

### Dual DTO Strategy

**CRITICAL**: This project uses a dual DTO approach for validation and documentation:

1. **Zod Schemas** (for runtime validation):
   - Located in: `src/modules/<module>/application/dto/*.dto.ts`
   - Format: `ExampleDtoSchema` (Zod schema) + `ExampleDto` (inferred type)
   - Used for: Runtime validation in controllers/services
   - Example:
   ```typescript
   import { z } from 'zod';

   export const CreateUserDtoSchema = z.object({
     email: z.string().email('Invalid email'),
     name: z.string().min(1, 'Name required'),
   });

   export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
   ```

2. **Class DTOs** (for Swagger documentation):
   - Located in: `src/modules/<module>/application/dto/*.class.dto.ts`
   - Format: `ExampleClassDto` (class with `@ApiProperty` decorators)
   - Used for: Swagger schema generation and documentation
   - Example:
   ```typescript
   import { ApiProperty } from '@nestjs/swagger';

   export class CreateUserClassDto {
     @ApiProperty({
       description: 'User email address',
       example: 'john@example.com',
       format: 'email',
     })
     email: string;

     @ApiProperty({
       description: 'User full name',
       example: 'John Doe',
       minLength: 1,
     })
     name: string;
   }
   ```

**Why Both?**: Zod provides superior runtime validation with detailed error messages, while Swagger requires class-based DTOs with decorators for metadata generation.

### Controller Documentation Standards

**MANDATORY**: All controllers must be fully documented with Swagger decorators:

```typescript
import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponseCustom,
  ApiInternalServerErrorResponseCustom,
} from '@src/common/decorators/api-responses.decorator';

@ApiTags('ModuleName') // ← REQUIRED: Group endpoints by module
@Controller('module')
export class ExampleController {

  @Post()
  @ApiOperation({
    summary: 'Short description (< 50 chars)',  // ← REQUIRED
    description: 'Detailed explanation of what this endpoint does, ' +
                 'including side effects and business logic.',  // ← REQUIRED
  })
  @ApiBody({ type: CreateExampleClassDto })  // ← REQUIRED for POST/PUT/PATCH
  @ApiResponse({
    status: 201,
    description: 'Success case description',
    type: ExampleResponseClassDto,  // ← REQUIRED: Response type
  })
  @ApiBadRequestResponse()  // ← REQUIRED
  @ApiInternalServerErrorResponseCustom()  // ← REQUIRED
  async create(@Body() body: unknown) {
    // Validate with Zod
    const dto = CreateExampleDtoSchema.parse(body);
    // ...
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')  // ← REQUIRED for protected routes
  @ApiOperation({ summary: 'Get protected data' })
  @ApiResponse({
    status: 200,
    description: 'Data retrieved successfully',
    type: ExampleResponseClassDto,
  })
  @ApiUnauthorizedResponseCustom()  // ← REQUIRED for protected routes
  async getProtected(@Request() req: AuthenticatedRequest) {
    // ...
  }
}
```

### Available Response Decorators

Located in `src/common/decorators/api-responses.decorator.ts`:

- `@ApiBadRequestResponse()` - 400 Bad Request (validation errors)
- `@ApiUnauthorizedResponseCustom()` - 401 Unauthorized (auth failed)
- `@ApiNotFoundResponseCustom(resourceName)` - 404 Not Found
- `@ApiConflictResponseCustom(message)` - 409 Conflict (duplicate resource)
- `@ApiInternalServerErrorResponseCustom()` - 500 Internal Server Error
- `@ApiCommonErrorResponses()` - Combines 400, 401, 500

### Swagger Best Practices

1. **@ApiOperation**: Always provide both `summary` (short) and `description` (detailed)
2. **@ApiResponse**: Document ALL possible response status codes
3. **@ApiBody**: Always specify for POST/PUT/PATCH endpoints
4. **@ApiBearerAuth**: MUST be present on all protected routes (with `JwtAuthGuard`)
5. **Examples**: Include realistic examples in `@ApiProperty` decorators
6. **Response Types**: Always specify response DTO class, never use generic objects

### Testing with Swagger UI

1. Start server: `npm run start:dev`
2. Open: http://localhost:3000/api/docs
3. For protected endpoints:
   - Click "Authorize" button (top right)
   - Paste JWT token from `/auth/signup` or `/auth/login` response
   - Click "Authorize" then "Close"
   - Token will be included in all subsequent requests

## Type Safety Requirements

### Strict TypeScript Configuration

This project enforces **strict type safety**:
- `isolatedModules: true`
- `emitDecoratorMetadata: true`
- **NO `any` types allowed** (ESLint will fail)
- **NO unsafe assignments** (ESLint will fail)

### Type-Only Imports

When importing types used in decorator signatures, **MUST** use `import type`:

```typescript
// ✅ CORRECT
import type { AuthenticatedRequest } from '@modules/auth/infra/api/types/authenticated-request.interface';

// ❌ WRONG - Will fail compilation
import { AuthenticatedRequest } from '@modules/auth/infra/api/types/authenticated-request.interface';
```

**Why?**: TypeScript's `emitDecoratorMetadata` requires type-only imports to be explicitly marked to avoid runtime errors.

### Authenticated Request Typing

For protected routes, **ALWAYS** use the typed `AuthenticatedRequest` interface:

```typescript
import type { AuthenticatedRequest } from '@modules/auth/infra/api/types/authenticated-request.interface';

@Get('me')
@UseGuards(JwtAuthGuard)
async getCurrentUser(@Request() req: AuthenticatedRequest): UserResponseDto {
  // ✅ TypeScript knows req.user is DBUser
  return {
    id: req.user.id,           // ✅ Type: string
    email: req.user.email,     // ✅ Type: string
    avatarUrl: req.user.avatarUrl ?? undefined,  // ✅ Handle null properly
  };
}
```

**NEVER** use `@Request() req` without type annotation - it defaults to `any` and will fail ESLint.

### Null/Undefined Handling

**CRITICAL**: Use proper null handling operators:

```typescript
// ✅ CORRECT - Nullish coalescing
const avatar = user.avatarUrl ?? 'default-avatar.png';

// ✅ CORRECT - Optional chaining
const teamName = user.team?.name;

// ❌ WRONG - Can cause runtime errors
const avatar = user.avatarUrl || 'default-avatar.png';  // 0 or '' would trigger fallback
```

### Service Method Signatures

All service methods **MUST** have explicit return types:

```typescript
// ✅ CORRECT
async createTeam(userId: string, name: string): Promise<DBTeam> {
  // ...
}

// ❌ WRONG - Implicit return type
async createTeam(userId: string, name: string) {
  // ...
}
```

### Controller Method Signatures

Controller methods should specify return types for documentation clarity:

```typescript
// ✅ BEST - Explicit return type matching response DTO
@Get('user')
async getUser(@Param('id') id: string): Promise<UserResponseDto> {
  return this.userService.findById(id);
}

// ✅ ACCEPTABLE - Promise<T> for complex returns
async createUser(@Body() dto: CreateUserDto): Promise<AuthResponseDto> {
  return this.authService.signup(dto);
}
```

### EntityManager Transaction Typing

When adding transaction support to methods, use optional `EntityManager`:

```typescript
async create(
  dto: CreateDto,
  entityManager?: EntityManager,  // ← Optional for transaction support
): Promise<Entity> {
  const repo = entityManager
    ? entityManager.getRepository(Entity)
    : this.repository;

  return repo.save(repo.create(dto));
}
```

This allows the method to work both standalone and within transactions.

## Important Notes

- **Port**: Application runs on port 3000 by default (see `main.ts`)
- **API Documentation**: Available at http://localhost:3000/api/docs
- **CORS**: Not configured by default - add `app.enableCors()` in `main.ts` if needed
- **Node version**: >= 20.0.0 required
- **NPM version**: >= 10.0.0 required
- **Hot reload**: Available in development mode with `npm run start:dev`
- **Migrations**: Must be run manually - `synchronize` is disabled in production
- **Type Safety**: ESLint will fail on `any` types, unsafe assignments, or missing type annotations
