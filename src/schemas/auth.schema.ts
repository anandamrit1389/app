import { PASSWORD_REGEX } from '@/helpers/constants/regex.const';
import { z } from 'zod';

export const LoginSchemaDef = z.object({
  email: z.string().email(),
  password: z.string().regex(PASSWORD_REGEX),
});

export const createLoginSchema = (t: (key: string) => string) =>
  LoginSchemaDef.extend({
    email: z
      .string({
        required_error: t('emailRequired'),
      })
      .email({ message: t('emailInvalid') }),

    password: z
      .string({
        required_error: t('passwordRequired'),
      })
      .regex(PASSWORD_REGEX, {
        message: t('passwordInvalid'),
      }),
  });

export const SignUpSchemaDef = z.object({
  email: z.string().email(),
  password: z.string().regex(PASSWORD_REGEX),
  confirmPassword: z.string().optional(),
});

export const createSignUpSchema = (t: (key: string) => string) =>
  SignUpSchemaDef.extend({
    email: z.string({ required_error: t('emailRequired') }).email({ message: t('emailInvalid') }),

    password: z.string({ required_error: t('passwordRequired') }).regex(PASSWORD_REGEX, {
      message: t('passwordInvalid'),
    }),
  });

export const DevAccessSchema = z.object({
  password: z.string(),
});

export const createResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z.string().regex(PASSWORD_REGEX, {
        message: t('passwordInvalid'),
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordsDontMatch'),
      path: ['confirmPassword'],
    });

export const ForgotPasswordSchemaDef = z.object({
  email: z.string().email(),
});

export const createForgotPasswordSchema = (t: (key: string) => string) =>
  ForgotPasswordSchemaDef.extend({
    email: z.string({ required_error: t('emailRequired') }).email({ message: t('emailInvalid') }),
  });
