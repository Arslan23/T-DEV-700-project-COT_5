// import type { User } from '../app/store/slices/authSlice';

// export type User = { id: string; name: string; email: string; role: Role };
// export type Role = 'user' | 'manager' | 'company_admin';
// export type Token = string;


// export interface LoginCredentials {
//   email: string;
//   // password: string;
//   otp: string;
//   session_token: string;
// }

// export interface LoginResponse {
//   access: string;
//   refresh: string;
// }

// types/auth.types.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginInitResponse {
  detail: string;
  session_token: string;
}

export interface Verify2FAParams {
  email: string;
  otp: string;
  session_token: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: any;
}