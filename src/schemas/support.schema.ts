import { z } from 'zod';

export const supportSchema = z.object({
  message: z.string(),
  files: z.instanceof(FileList).nullable(),
});
