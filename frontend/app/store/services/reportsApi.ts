// KPIs and reports endpoints
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: () => ({})
});
