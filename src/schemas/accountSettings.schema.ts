import { z } from 'zod';

export const notificationsSettingsSchema = z.object({
  newFeatures: z.boolean(),
  inspirationTutorials: z.boolean(),
  offers: z.boolean(),
});

export const accountSettingsSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  firstName: z.string(),
  lastName: z.string(),
  profileImg: z.string().nullable(),
});
