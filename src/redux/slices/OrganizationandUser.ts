// src/store/organizationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrganizationandUser {
    organization: {
        createdAt: string;
        meetingServerUrl: string;
        organizationName: string;
        updatedAt: string;
        organizationId: string;
        authToken: string;
    };
    currentUser?: {
        meetingIds: string[];
        organizationId: string;
        updatedAt: string;
        userId: string;
        userName: string;
        createdAt: string;
        avatarUrl: string | null;
        emailId: string;
        externalUserId: string;
    };
}

const initialState: OrganizationandUser = {
    organization: {
        createdAt: "",
        meetingServerUrl: "",
        organizationName: "",
        updatedAt: "",
        organizationId: "",
        authToken: "",
    },
};

const organizationSlice = createSlice({
    name: "organization",
    initialState,
    reducers: {
        setOrganization: (state, action: PayloadAction<OrganizationandUser["organization"]>) => {
            state.organization = action.payload;
        },
        setCurrentUserDetails: (state, action: PayloadAction<OrganizationandUser["currentUser"]>) => {
            state.currentUser = action.payload;
        },
    },
});

export const { setOrganization, setCurrentUserDetails } = organizationSlice.actions;

export default organizationSlice.reducer;
