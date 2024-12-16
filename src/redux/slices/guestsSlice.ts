import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GuestOption } from '../../components/CreateMeeting/types/CreateMeeting.types';

  
// Initial state
const initialState: GuestOption[] = [
  { email: "john.doe@example.com", selected: false },
  { email: "jane.doe@example.com", selected: false },
  { email: "guest1@example.com", selected: false },
  { email: "guest2@example.com", selected: false },
  { email: "mike.smith@example.com", selected: false },
  { email: "sarah.connor@example.com", selected: false },
  { email: "emma.brown@example.com", selected: false },
  { email: "oliver.jones@example.com", selected: false },
  { email: "ava.taylor@example.com", selected: false },
  { email: "william.johnson@example.com", selected: false },
  { email: "sophia.martin@example.com", selected: false },
  { email: "james.anderson@example.com", selected: false },
  { email: "mia.thompson@example.com", selected: false },
  { email: "charlotte.moore@example.com", selected: false },
  { email: "liam.walker@example.com", selected: false },
  { email: "isabella.white@example.com", selected: false },
  { email: "elijah.hall@example.com", selected: false },
  { email: "amelia.clark@example.com", selected: false },
  { email: "lucas.lewis@example.com", selected: false },
  { email: "harper.scott@example.com", selected: false },
];

// Create a slice
const guestsSlice = createSlice({
  name: 'guests',
  initialState,
  reducers: {
    setGuests: (state, action: PayloadAction<GuestOption[]>) => {
      return action.payload;
    }
  }
});

// Export actions
export const { setGuests } = guestsSlice.actions;

// Export reducer
export default guestsSlice.reducer;
