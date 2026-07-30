export type UserRole = "admin" | "vip";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthError {
  message: string;
}
