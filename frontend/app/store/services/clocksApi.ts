import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const clocksApi = createApi({
  reducerPath: 'clocksApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    clockInOut: builder.mutation<void, void>({
      query: () => ({
        url: '/clocks/toggle',
        method: 'POST',
      }),
    }),
  }),
});

export const { useClockInOutMutation } = clocksApi;
