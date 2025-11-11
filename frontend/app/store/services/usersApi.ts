import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type { User, CreateUserInput, UpdateUserInput, UserPreferences, NotificationSettings } from 'types/user.types';

export interface UserStats {
  totalWorkingHours: number;
  weeklyHours: number;
  monthlyHours: number;
  averageDailyHours: number;
  lateCount: number;
  absenceCount: number;
  overtimeHours: number;
}
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';


export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
    credentials: 'include'
  }),
  tagTypes: ['User', 'Users', 'UserDetail'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users/',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Users' as const, id })), { type: 'Users', id: 'LIST' }]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    updateUserProfile: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    // Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'UserDetail', id }],
    }),

    // Get users by role
    getUsersByRole: builder.query<User[], string>({
      query: (role) => `/users?role=${role}`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Users' as const, id })),
            { type: 'Users', id: 'LIST' },
          ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // Get users by team
    getUsersByTeam: builder.query<User[], string>({
      query: (teamId) => `/users?teamId=${teamId}`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Users' as const, id })),
            { type: 'Users', id: 'LIST' },
          ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // Create user
    createUser: builder.mutation<User, CreateUserInput>({
      query: (user) => ({
        url: '/auth/register/',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // Update user
    updateUser: builder.mutation<User, { id: string; data: UpdateUserInput }>({
      query: ({ id, data }) => ({
        url: `/users/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        { type: 'UserDetail', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // Update user password
    updateUserPassword: builder.mutation<
      void,
      { id: string; currentPassword: string; newPassword: string }
    >({
      query: ({ id, currentPassword, newPassword }) => ({
        url: `/users/${id}/password`,
        method: 'PUT',
        body: { currentPassword, newPassword },
      }),
    }),

    // Update user preferences
    updateUserPreferences: builder.mutation<
      UserPreferences,
      { id: string; preferences: Partial<UserPreferences> }
    >({
      query: ({ id, preferences }) => ({
        url: `/users/${id}/preferences`,
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'UserDetail', id }],
    }),

    // Update notification settings
    updateNotificationSettings: builder.mutation<
      NotificationSettings,
      { id: string; settings: Partial<NotificationSettings> }
    >({
      query: ({ id, settings }) => ({
        url: `/users/${id}/notifications`,
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'UserDetail', id }],
    }),

    // Get user statistics
    getUserStats: builder.query<UserStats, string>({
      query: (userId) => `/users/${userId}/stats`,
      providesTags: (result, error, userId) => [{ type: 'UserDetail', id: userId }],
    }),

    // Bulk delete users
    bulkDeleteUsers: builder.mutation<void, string[]>({
      query: (userIds) => ({
        url: '/users/bulk-delete',
        method: 'POST',
        body: { userIds },
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    // Search users
    searchUsers: builder.query<User[], string>({
      query: (searchTerm) => `/users/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Users' as const, id })),
            { type: 'Users', id: 'LIST' },
          ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserProfileMutation,
  useGetUserByIdQuery,
  useGetUsersByRoleQuery,
  useGetUsersByTeamQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserPasswordMutation,
  useUpdateUserPreferencesMutation,
  useUpdateNotificationSettingsMutation,
  useGetUserStatsQuery,
  useBulkDeleteUsersMutation,
  useSearchUsersQuery
} = usersApi;
