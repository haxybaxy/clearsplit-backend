# Supabase Authentication Setup Guide

## Overview
This backend now has a complete Supabase Auth integration with bearer token authorization. The auth system uses:
- **Supabase** for user authentication (email/password)
- **PostgreSQL + TypeORM** for storing user data
- **Local JWT verification** for fast token validation
- **Bearer tokens** stored in frontend localStorage

## Configuration

### 1. Environment Variables
Update your `.env` file with your Supabase credentials:

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY`
   - JWT Secret → `SUPABASE_JWT_SECRET`

### 2. Database Migration
The User entity has been updated with a `supabaseId` field. Run migrations:

```bash
npm run typeorm migration:generate -- -n AddSupabaseIdToUser
npm run typeorm migration:run
```

## API Endpoints

### POST /auth/signup
Register a new user and sync to database.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "v1.MRjHJoHe...",
  "user": {
    "id": "uuid-from-your-db",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": null
  }
}
```

### POST /auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "v1.MRjHJoHe...",
  "user": {
    "id": "uuid-from-your-db",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": null
  }
}
```

### GET /auth/me
Get current authenticated user (protected route).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "uuid-from-your-db",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": null
}
```

## Frontend Integration

### 1. Login Flow
```typescript
// Using fetch or axios
const response = await fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { accessToken, refreshToken, user } = await response.json();

// Store tokens in localStorage
localStorage.setItem('access_token', accessToken);
localStorage.setItem('refresh_token', refreshToken);
```

### 2. Making Authenticated Requests
```typescript
const token = localStorage.getItem('access_token');

const response = await fetch('http://localhost:5000/some-protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 3. Signup Flow
```typescript
const response = await fetch('http://localhost:5000/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newuser@example.com',
    password: 'securepassword',
    firstName: 'Jane',
    lastName: 'Smith'
  })
});

const { accessToken, refreshToken, user } = await response.json();
localStorage.setItem('access_token', accessToken);
localStorage.setItem('refresh_token', refreshToken);
```

## Protecting Routes

To protect any route in your backend, use the `JwtAuthGuard`:

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProtectedData(@Request() req) {
    // req.user contains the authenticated user
    const userId = req.user.id;
    const userEmail = req.user.email;

    return { message: 'This is protected data', user: req.user };
  }
}
```

## Architecture Details

### How Authentication Works

1. **Signup/Login**: Frontend sends credentials to `/auth/signup` or `/auth/login`
2. **Supabase Auth**: Backend creates/authenticates user with Supabase
3. **Database Sync**: User record is created/retrieved from PostgreSQL database
4. **Token Response**: Supabase JWT tokens returned to frontend
5. **Token Storage**: Frontend stores tokens in localStorage
6. **Protected Requests**: Frontend includes token in `Authorization: Bearer <token>` header
7. **JWT Verification**: Backend verifies token signature using Supabase JWT secret (locally, no API call)
8. **User Lookup**: Backend loads user from database and attaches to `request.user`

### Key Components

- **AuthModule** (`src/modules/auth/auth.module.ts`): Main auth module
- **AuthService** (`src/modules/auth/auth.service.ts`): Handles Supabase integration and user sync
- **AuthController** (`src/modules/auth/auth.controller.ts`): Exposes auth endpoints
- **JwtStrategy** (`src/modules/auth/strategies/jwt.strategy.ts`): Passport strategy for JWT validation
- **JwtAuthGuard** (`src/modules/auth/guards/jwt-auth.guard.ts`): Guard to protect routes
- **UserService** (`src/modules/user/user.service.ts`): Database operations for users
- **UserEntity** (`src/modules/user/infra/repositories/model/user.entity.ts`): User data model with `supabaseId`

### Security Features

✅ **Local JWT verification** - No external API calls per request
✅ **Separate auth and data layers** - Supabase for auth, your DB for data
✅ **Automatic user sync** - Users created in both systems on signup
✅ **Validated DTOs** - Using Zod schemas for input validation
✅ **Unique constraints** - Email and supabaseId are unique in database

## Testing

### 1. Start the server
```bash
npm run start:dev
```

### 2. Test signup
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Test login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Test protected route
```bash
# Replace <token> with the accessToken from signup/login response
curl http://localhost:5000/auth/me \
  -H "Authorization: Bearer <token>"
```

## Troubleshooting

### "SUPABASE_URL is not configured"
- Make sure you've added all three Supabase environment variables to `.env`
- Restart your server after updating `.env`

### "User not found" after successful login
- This means the user exists in Supabase but not in your database
- This shouldn't happen with the auto-sync, but can be fixed by re-registering

### "Invalid email or password"
- Credentials are incorrect
- User might not exist yet - try signup first

### CORS errors from frontend
- Add CORS configuration in `main.ts`:
```typescript
app.enableCors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
});
```

## Next Steps

1. ✅ Configure Supabase credentials in `.env`
2. ✅ Run database migrations
3. ✅ Test the authentication flow
4. ⬜ Add email verification (optional)
5. ⬜ Implement token refresh logic (optional)
6. ⬜ Add password reset functionality (optional)
7. ⬜ Add OAuth providers (Google, GitHub, etc.) (optional)

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [NestJS Passport Documentation](https://docs.nestjs.com/security/authentication)
- [TypeORM Documentation](https://typeorm.io/)
