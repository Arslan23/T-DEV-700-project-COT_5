// UI slice
import { createSlice } from '@reduxjs/toolkit';
const initialState = { sidebarOpen: false, modals: {} };
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {}
});
export default uiSlice.reducer;
