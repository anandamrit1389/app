import { z } from 'zod';

import { User } from '@/interfaces/IUser';
import {
  LoginSchemaDef,
  SignUpSchemaDef,
  DevAccessSchema,
  ForgotPasswordSchemaDef,
} from '@/schemas/auth.schema';

export type Auth = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = Auth & {
  user: User;
};

export type LoginCredentials = z.infer<typeof LoginSchemaDef>;
export type SignUpCredentials = z.infer<typeof SignUpSchemaDef>;
export type ForgotPasswordCredentials = z.infer<typeof ForgotPasswordSchemaDef>;

export type VerifyCredentaials = { code: string };

export type RegisterResponse = {
  id: string;
  email: string;
};

export interface AppleLoginResponse {
  authorization: {
    code: string;
    id_token: string;
    state: string;
  };
}

export type DevAccessCredentials = z.infer<typeof DevAccessSchema>;
