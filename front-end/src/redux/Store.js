import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./EventSlice";
import locationReducer from "./LocationSlice";

const store = configureStore({
  reducer: {
    events: eventReducer,  
    locations:locationReducer,
  },
});

export default store;