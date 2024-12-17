
interface OrganizationState{
  createdAt: string;
  meetingServerUrl: string;
  organizationName: string;
  updatedAt: string;
  organizationId: string;
  authToken: string;
}

export interface UserDetailsResponse {
  meetingIds: string[];
  organizationId: string;
  updatedAt: string;
  userId: string;
  userName: string;
  createdAt: string;
  avatarUrl: string | null;
  emailId: string;
  externalUserId: string;
}

export interface OrganizationResponse {
  organization: OrganizationState;
}

export interface TokenRequest {
  token: string;
}

export interface CreateUserRequest {
  externalUserId: string;
  userName: string;
  emailId: string;
  avatarUrl: string;
  organizationId: string;
}

export interface CreateUserResponse {
  message: string;
}

type Participant = {
  userName: string;
  externalUserId: string;
  emailId: string;
};

export type MeetingResponse = {
  participants: Participant[];
  createdAt: string;
  serverUrl: string;
  startTime: string;
  endTime: string;
  meetingId: string;
  hostId: string;
  organizationId: string;
  updatedAt: string;
  botUrl: string;
  description: string;
  title: string;
  type: string;  // Assuming 'SCHEDULE' and 'IMMEDIATE' as possible types, adjust as needed
};

export const currentUserDetailsfromFrontend =  {
  externalUserId: "external-host-1",
  userName: "Sample Host 1",
  emailId: "samplehost1@mailinator.com",
  avatarUrl: "https://i.pravatar.cc/300?img=54",
}