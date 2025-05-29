import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./EventSlice";

const store = configureStore({
  reducer: {
    events: eventReducer,  
  },
});

export default store;