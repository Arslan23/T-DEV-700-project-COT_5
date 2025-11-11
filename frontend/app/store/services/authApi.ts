// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import type { RootState } from '../store';
// import type { LoginCredentials, LoginResponse } from 'types/auth.types';
// import type { User } from 'types/user.types';
// import { getTokenFromCookie } from '~/utils/helper';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     prepareHeaders: (headers, { getState }) => {
//       // Try to get token from Redux store first
//       let token = (getState() as RootState).auth.token;

//       // If not in store, try to get from cookie (important for page refresh)
//       if (!token) {
//         token = getTokenFromCookie();
//       }

//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }

//       return headers;
//     },
//     credentials: 'include'
//   }),
//   tagTypes: ['Auth', 'CurrentUser'],
//   endpoints: (builder) => ({
//     login: builder.mutation<LoginResponse, LoginCredentials>({
//       query: (body) => ({
//         url: '/login/verify/',
//         method: 'POST',
//         body: body
//       }),
//       invalidatesTags: ['CurrentUser'],
//       transformErrorResponse: (response: any) => {
//         return {
//           status: response.status,
//           data: response.data,
//           message: response.data?.message || 'Login failed',
//         };
//       },
//     }),

//     getCurrentUser: builder.query<User, void>({
//       query: () => '/users/me/',
//       providesTags: ['CurrentUser'],
//       // Retry logic
//       // extraOptions: { maxRetries: 1 },
//     }),

//     logout: builder.mutation<void, void>({
//       query: () => ({
//         url: '/auth/logout',
//         method: 'POST',
//       }),
//       invalidatesTags: ['Auth', 'CurrentUser'],
//       // Handle logout even if API call fails
//       onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
//         try {
//           await queryFulfilled;
//         } catch {
//           // Even if API call fails, clear local state
//           console.log('Logout API call failed, but clearing local state');
//         } finally {
//           // Clear token cookie
//           document.cookie = 'token=; max-age=0; path=/';
//         }
//       },
//     }),

//     changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
//       query: (passwords) => ({
//         url: '/auth/change-password',
//         method: 'POST',
//         body: passwords,
//       }),
//     }),

//     requestPasswordReset: builder.mutation<void, { email: string }>({
//       query: (data) => ({
//         url: '/auth/forgot-password',
//         method: 'POST',
//         body: data,
//       }),
//     }),

//     resetPassword: builder.mutation<void, { token: string; newPassword: string }>({
//       query: (data) => ({
//         url: '/auth/reset-password',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//   }),
// });

// export const {
//   useLoginMutation,
//   useGetCurrentUserQuery,
//   useLogoutMutation,
//   useChangePasswordMutation,
//   useRequestPasswordResetMutation,
//   useResetPasswordMutation,
// } = authApi;


// ~/store/services/authApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type { LoginCredentials, LoginResponse, LoginInitResponse, Verify2FAParams } from 'types/auth.types';
import type { User } from 'types/user.types';
import { getTokenFromCookie } from '~/utils/helper';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      let token = (getState() as RootState).auth.token;
      if (!token) {
        token = getTokenFromCookie();
      }
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include'
  }),
  tagTypes: ['Auth', 'CurrentUser'],
  endpoints: (builder) => ({
    // 🔹 Nouvelle mutation : init 2FA
    loginInit: builder.mutation<LoginInitResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/login/init/',
        method: 'POST',
        body: credentials,
      }),
    }),

    // 🔹 Mutation existante : verify 2FA (renommée pour plus de clarté)
    loginVerify: builder.mutation<LoginResponse, Verify2FAParams>({
      query: (params) => ({
        url: '/login/verify/',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['CurrentUser'],
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'Login failed',
        };
      },
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => '/users/me/',
      providesTags: ['CurrentUser'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'CurrentUser'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch {
          console.log('Logout API call failed, but clearing local state');
        } finally {
          document.cookie = 'token=; max-age=0; path=/';
        }
      },
    }),

    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (passwords) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),

    requestPasswordReset: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<void, { token: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// 🔹 Export des hooks mis à jour
export const {
  useLoginInitMutation,
  useLoginVerifyMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useChangePasswordMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;