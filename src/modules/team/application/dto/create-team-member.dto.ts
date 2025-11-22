import { z } from 'zod';
import { TeamMemberRole } from '@modules/team/domain/team-member-role.value-object';

export const CreateTeamMemberDtoSchema = z.object({
  teamId: z.string().uuid('Team ID must be a valid UUID'),
  userId: z.string().uuid('User ID must be a valid UUID'),
  role: z.nativeEnum(TeamMemberRole),
});

export type CreateTeamMemberDto = z.infer<typeof CreateTeamMemberDtoSchema>;
