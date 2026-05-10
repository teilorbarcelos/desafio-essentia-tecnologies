import { Static, Type } from '@sinclair/typebox';

export const LoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export type LoginDTO = Static<typeof LoginSchema>;

export const RefreshSchema = Type.Object({
  refreshToken: Type.String(),
});

export type RefreshDTO = Static<typeof RefreshSchema>;

export const ChangePasswordSchema = Type.Object({
  currentPassword: Type.String(),
  newPassword: Type.String({ minLength: 6 }),
});

export type ChangePasswordDTO = Static<typeof ChangePasswordSchema>;

export const AuthResponseSchema = Type.Object({
  token: Type.String(),
  refreshToken: Type.String(),
});

export const UserMeResponseSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: Type.String({ format: 'email' }),
  name: Type.Optional(Type.String()),
});
