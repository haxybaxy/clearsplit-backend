import { Request } from 'express';
import { DBUser } from '@modules/user/infra/repositories/model/user.entity';

/**
 * Extended Express Request interface with authenticated user
 * Used after JWT authentication via JwtAuthGuard
 */
export interface AuthenticatedRequest extends Request {
  user: DBUser;
}
