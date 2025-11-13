# Protected Route Example

This guide shows you how to add authentication to your existing controllers.

## Example: Protecting Team Routes

Let's say you want to protect your team routes so only authenticated users can access them.

### Before (No Authentication)
```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getAllTeams() {
    return this.teamService.findAll();
  }

  @Post()
  async createTeam(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }
}
```

### After (With Authentication)
```typescript
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard) // 👈 Protect entire controller
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getAllTeams(@Request() req) {
    // req.user contains the authenticated user
    const userId = req.user.id;
    return this.teamService.findAllForUser(userId);
  }

  @Post()
  async createTeam(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    // Access authenticated user info
    const userId = req.user.id;
    return this.teamService.create({
      ...createTeamDto,
      ownerId: userId,
    });
  }
}
```

## Alternative: Protect Individual Routes

If you only want to protect specific routes:

```typescript
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('public')
  // 👇 This route is public, no guard
  async getPublicTeams() {
    return this.teamService.findPublicTeams();
  }

  @Get('my-teams')
  @UseGuards(JwtAuthGuard) // 👈 Only this route is protected
  async getMyTeams(@Request() req) {
    const userId = req.user.id;
    return this.teamService.findAllForUser(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard) // 👈 Protected
  async createTeam(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    const userId = req.user.id;
    return this.teamService.create({
      ...createTeamDto,
      ownerId: userId,
    });
  }
}
```

## What's Available in `req.user`

After authentication, the `req.user` object contains:

```typescript
{
  id: string;           // Your database user ID (UUID)
  supabaseId: string;   // Supabase auth user ID
  email: string;        // User's email
  firstName: string;    // User's first name
  lastName: string;     // User's last name
  avatarUrl?: string;   // User's avatar URL (if set)
}
```

## Frontend Integration

When making requests to protected routes from your frontend:

```typescript
// Store token after login/signup
const { accessToken } = await loginOrSignup();
localStorage.setItem('access_token', accessToken);

// Use token in subsequent requests
const token = localStorage.getItem('access_token');

const response = await fetch('http://localhost:5000/teams/my-teams', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});
```

## Error Responses

### 401 Unauthorized
When no token is provided or token is invalid:
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
When token is valid but user doesn't have permission (if you implement role-based auth later):
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

## Next Steps

1. Add `@UseGuards(JwtAuthGuard)` to controllers you want to protect
2. Use `@Request() req` to access `req.user` in your handlers
3. Update your services to filter data based on the authenticated user
4. Test with Postman or curl using Bearer tokens

## Common Patterns

### Creating resources owned by user
```typescript
@Post()
@UseGuards(JwtAuthGuard)
async createProperty(@Body() dto: CreatePropertyDto, @Request() req) {
  return this.propertyService.create({
    ...dto,
    ownerId: req.user.id, // Associate with logged-in user
  });
}
```

### Filtering resources by user
```typescript
@Get()
@UseGuards(JwtAuthGuard)
async getMyTransactions(@Request() req) {
  // Only return transactions for this user
  return this.transactionService.findByUserId(req.user.id);
}
```

### Checking resource ownership
```typescript
@Delete(':id')
@UseGuards(JwtAuthGuard)
async deleteTransaction(@Param('id') id: string, @Request() req) {
  const transaction = await this.transactionService.findOne(id);

  if (transaction.userId !== req.user.id) {
    throw new ForbiddenException('You can only delete your own transactions');
  }

  return this.transactionService.delete(id);
}
```
