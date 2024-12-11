import { configureStore } from '@reduxjs/toolkit';
import meetingsReducer from "./slices/meetingsSlice";

const store = configureStore({
  reducer: {
    meetings: meetingsReducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;
