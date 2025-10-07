import { z } from 'zod';
import { InviteSchema } from '@/schemas/invite.schema';

export type InviteData = z.infer<typeof InviteSchema>;
