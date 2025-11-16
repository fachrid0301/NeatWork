// Type definitions for auth.api.js

export interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    username?: string;
  };
  [key: string]: any;
}

export interface RegisterResponse {
  message?: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
  [key: string]: any;
}

export interface RegisterParams {
  email: string;
  password: string;
  password_confirmation: string;
  username?: string;
  role?: string;
}

export function login(
  email: string,
  password: string
): Promise<LoginResponse>;

export function register(
  params: RegisterParams
): Promise<RegisterResponse>;

export function checkEmail(email: string): Promise<{ exists: boolean }>;

export function registerPetugas(params: {
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<RegisterResponse>;

export function logout(): Promise<void>;

