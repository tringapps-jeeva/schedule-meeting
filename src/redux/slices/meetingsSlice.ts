import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types.ts
export interface Meeting {
  id: number;
  title: string;
  time: string;
  participant: string;
}

export interface MeetingsState {
  meetings: { [key: string]: Meeting[] };
}

// Initial state
const initialState: MeetingsState = {
  meetings: {},
};

// Create a slice
const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    setMeetings: (
      state,
      action: PayloadAction<{ [key: string]: Meeting[] }>
    ) => {
      state.meetings = action.payload;
    },
  },
});

// Export actions
export const { setMeetings } = meetingsSlice.actions;

// Export reducer
export default meetingsSlice.reducer;
