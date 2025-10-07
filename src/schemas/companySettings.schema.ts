import { z } from 'zod';

export const companySettingsSchema = z.object({
  name: z.string(),
  imgUrl: z.string().nullable(),
});
