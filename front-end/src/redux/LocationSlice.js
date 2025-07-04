import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cities: [],
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    fetchLocationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLocationsSuccess: (state, action) => {
      state.loading = false;
      state.cities = action.payload;
    },
    fetchLocationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteLocationSuccess: (state, action) => {
      state.cities = state.cities.filter((city) => city !== action.payload);
    },
  },
});

export const {
  fetchLocationsStart,
  fetchLocationsSuccess,
  fetchLocationsFailure,
  deleteLocationSuccess,
} = locationSlice.actions;

export default locationSlice.reducer;

