export type UserRole = 'admin' | 'hr' | 'manager';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = Pick<User, 'id' | 'email' | 'name' | 'role'>;

export type AuthTokenPayload = {
  userId: string;
  role: UserRole;
};
