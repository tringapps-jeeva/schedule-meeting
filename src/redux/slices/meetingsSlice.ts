import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MeetingResponse } from "../../App.types";

export interface Meeting {
    id: string;
    title: string;
    time: string;
    participant: string;
    meetId: string;
    botUrl: string;
    serverUrl: string;
    hostId: string;
}

interface MeetingsState {
    meetingsByDate: Record<string, Meeting[]>;
}

const initialState: MeetingsState = {
    meetingsByDate: {},
};

const transformMeetingData = (data: MeetingResponse[]): Record<string, Meeting[]> => {
    return data.reduce((acc, meeting) => {
        const startDate = new Date(meeting.startTime);
        const endDate = new Date(meeting.endTime);

        const date = startDate.toISOString().split("T")[0];

        const time = `${startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

        const participant = meeting.participants?.[0]?.userName || "";

        const meetingDetails: Meeting = {
            id: meeting.meetingId,
            title: meeting.title || "Untitled Meeting",
            time,
            participant,
            meetId: meeting.meetingId,
            botUrl: meeting.botUrl,
            serverUrl: meeting.serverUrl,
            hostId: meeting.hostId
        };

        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(meetingDetails);

        return acc;
    }, {} as Record<string, Meeting[]>);
};

const meetingsSlice = createSlice({
    name: "meetings",
    initialState,
    reducers: {
        // Action to set the meetings, transforming the payload to the grouped format
        setMeetings(state, action: PayloadAction<MeetingResponse[]>) {
            state.meetingsByDate = transformMeetingData(action.payload);
        },
    },
});

// Export the action and reducer
export const { setMeetings } = meetingsSlice.actions;
export default meetingsSlice.reducer;
