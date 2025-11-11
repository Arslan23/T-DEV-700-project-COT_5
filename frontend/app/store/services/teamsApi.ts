import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type { Team, CreateTeamInput, UpdateTeamInput, TeamStats } from 'types/team.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Teams', 'TeamDetails'],
  endpoints: (builder) => ({
    // Get all teams
    getTeams: builder.query<Team[], void>({
      query: () => '/teams',
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Teams' as const, id })),
            { type: 'Teams', id: 'LIST' },
          ]
          : [{ type: 'Teams', id: 'LIST' }],
    }),

    getTeamById: builder.query<Team, string>({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: 'TeamDetails', id }],
    }),

    getTeamsByManager: builder.query<Team[], string>({
      query: (managerId) => `/teams?managerId=${managerId}`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Teams' as const, id })),
            { type: 'Teams', id: 'LIST' },
          ]
          : [{ type: 'Teams', id: 'LIST' }],
    }),

    createTeam: builder.mutation<Team, CreateTeamInput>({
      query: (team) => ({
        url: '/teams/',
        method: 'POST',
        body: team,
      }),
      invalidatesTags: [{ type: 'Teams', id: 'LIST' }],
    }),

    updateTeam: builder.mutation<Team, { id: string; data: UpdateTeamInput }>({
      query: ({ id, data }) => ({
        url: `/teams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Teams', id },
        { type: 'TeamDetails', id },
        { type: 'Teams', id: 'LIST' },
      ],
    }),

    deleteTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Teams', id },
        { type: 'Teams', id: 'LIST' },
      ],
    }),

    addTeamMember: builder.mutation<Team, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/add_member/`,
        method: 'POST',
        body: { user_id: userId },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        { type: 'TeamDetails', id: teamId },
      ],
    }),

    removeTeamMember: builder.mutation<Team, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/remove_member/`,
        method: 'POST',
        body: { user_id: userId }
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        { type: 'TeamDetails', id: teamId },
      ],
    }),

    getTeamStats: builder.query<TeamStats, string>({
      query: (teamId) => `/teams/${teamId}/stats`,
      providesTags: (result, error, teamId) => [{ type: 'TeamDetails', id: teamId }],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useGetTeamsByManagerQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useGetTeamStatsQuery,
} = teamsApi;