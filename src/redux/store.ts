import { configureStore } from '@reduxjs/toolkit';
import meetingsReducer from "./slices/meetingsSlice";
import guestsReducer from "./slices/guestsSlice"

const store = configureStore({
  reducer: {
    meetings: meetingsReducer,
    guests: guestsReducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;
