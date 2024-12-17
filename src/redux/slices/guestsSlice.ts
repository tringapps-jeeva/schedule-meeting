import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GuestOption } from '../../components/CreateMeeting/types/CreateMeeting.types';

  
// Initial state
const initialState: GuestOption[] = [
  { externalUserId: "external-user-1", userName: "Sample User 1", emailId: "Sampleuser1@mailinator.com", selected: false },
  { externalUserId: "external-user-2", userName: "John Doe", emailId: "john.doe@example.com", selected: false },
  { externalUserId: "external-user-3", userName: "Jane Doe", emailId: "jane.doe@example.com", selected: false },
  { externalUserId: "external-user-4", userName: "Guest 1", emailId: "guest1@example.com", selected: false },
  { externalUserId: "external-user-5", userName: "Guest 2", emailId: "guest2@example.com", selected: false },
  { externalUserId: "external-user-6", userName: "Mike Smith", emailId: "mike.smith@example.com", selected: false },
  { externalUserId: "external-user-7", userName: "Sarah Connor", emailId: "sarah.connor@example.com", selected: false },
  { externalUserId: "external-user-8", userName: "Emma Brown", emailId: "emma.brown@example.com", selected: false },
  { externalUserId: "external-user-9", userName: "Oliver Jones", emailId: "oliver.jones@example.com", selected: false },
  { externalUserId: "external-user-10", userName: "Ava Taylor", emailId: "ava.taylor@example.com", selected: false },
  { externalUserId: "external-user-11", userName: "William Johnson", emailId: "william.johnson@example.com", selected: false },
  { externalUserId: "external-user-12", userName: "Sophia Martin", emailId: "sophia.martin@example.com", selected: false },
  { externalUserId: "external-user-13", userName: "James Anderson", emailId: "james.anderson@example.com", selected: false },
  { externalUserId: "external-user-14", userName: "Mia Thompson", emailId: "mia.thompson@example.com", selected: false },
  { externalUserId: "external-user-15", userName: "Charlotte Moore", emailId: "charlotte.moore@example.com", selected: false },
  { externalUserId: "external-user-16", userName: "Liam Walker", emailId: "liam.walker@example.com", selected: false },
  { externalUserId: "external-user-17", userName: "Isabella White", emailId: "isabella.white@example.com", selected: false },
  { externalUserId: "external-user-18", userName: "Elijah Hall", emailId: "elijah.hall@example.com", selected: false },
  { externalUserId: "external-user-19", userName: "Amelia Clark", emailId: "amelia.clark@example.com", selected: false },
  { externalUserId: "external-user-20", userName: "Lucas Lewis", emailId: "lucas.lewis@example.com", selected: false },
  { externalUserId: "external-user-21", userName: "Harper Scott", emailId: "harper.scott@example.com", selected: false }
];


const guestsSlice = createSlice({
  name: 'guests',
  initialState,
  reducers: {
    setGuests: (state, action: PayloadAction<GuestOption[]>) => {
      return action.payload;
    }
  }
});

export const { setGuests } = guestsSlice.actions;

export default guestsSlice.reducer;
