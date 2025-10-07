import { z } from 'zod';

export const cookieSchema = z.object({
  essential: z.boolean().refine((val) => val === true, {
    message: 'Essential cookies must be enabled.',
  }),
  performance: z.boolean(),
  functional: z.boolean(),
  targeting: z.boolean(),
});
