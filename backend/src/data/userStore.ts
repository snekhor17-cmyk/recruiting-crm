import type { User } from '../types/auth.js';

const users = new Map<string, User>();

export function listUsers(): User[] {
  return Array.from(users.values());
}

export function findUserByEmail(email: string): User | undefined {
  return listUsers().find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return users.get(id);
}

export function upsertUser(user: User): User {
  users.set(user.id, user);
  return user;
}
