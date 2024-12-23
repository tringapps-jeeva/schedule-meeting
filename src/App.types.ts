
interface OrganizationState {
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

export const currentUserDetailsfromFrontend = {
  externalUserId: "external-host-1",
  userName: "Sample Host 1",
  emailId: "samplehost1@mailinator.com",
  avatarUrl: "https://i.pravatar.cc/300?img=54",
}

// headers.ts
export const getHeaders = () => {
  return {
      Authorization: "Bearer eyJraWQiOiJERmdxaERNN0pRT2VXWlRQdyt4UnRoRVA3UHN4bDFcL1VmNTZSR3YxNVBSOD0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiMnhzRjhYZzZnMkMwYzUycVVISVRTdyIsInZpZGVvY2hhdF9vcmdfYXBpa2V5IjoiMTBiMmM3MWZjYWQzMTk4ZDk2ODJjZDViZDM1YjQwNDM2ZDg0NjExMjMxYjE1NDM0MzNjODAyMWU2MzI1MzkzZiIsInN1YiI6IjA1ZjE2MWU3LTBlNTAtNGNhNi1hM2M4LWYyYWI1YmFlMTE1MyIsImNvZ25pdG86Z3JvdXBzIjpbImFwLXNvdXRoLTFfcXo5aHZDZzVIX0dvb2dsZSJdLCJjaGF0X29yZ19uYW1lIjoiVHJpbmdodWIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX3F6OWh2Q2c1SCIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU3NTgzOTQ5MzA1ODpyb2xlXC9jb2duaXRvX2F1dGhlbnRpY2F0ZWRfaGFzdXJhIl0sImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IjEwOTQ5Mzg4NzI4ODYwODYwNjgzMyIsInByb3ZpZGVyTmFtZSI6Ikdvb2dsZSIsInByb3ZpZGVyVHlwZSI6Ikdvb2dsZSIsImlzc3VlciI6bnVsbCwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE3MzQ1MDIyMzA4NTMifV0sInZpZGVvY2hhdF9vcmdfbmFtZSI6IlRyaW5naHViIiwiYXV0aF90aW1lIjoxNzM0NTg2NjYwLCJleHAiOjE3MzQ1OTAyNjAsImlhdCI6MTczNDU4NjY2MCwianRpIjoiNDQyMjJiODAtOWY2Yy00YmJmLWE4ZDQtMTVmNjFiOGViMDdhIiwiZW1haWwiOiJrYXdpbmtscnJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJodHRwczpcL1wvaGFzdXJhLmlvXC9qd3RcL2NsYWltcyI6IntcIngtaGFzdXJhLXVzZXItaWRcIjpcIjA1ZjE2MWU3LTBlNTAtNGNhNi1hM2M4LWYyYWI1YmFlMTE1M1wiLFwieC1oYXN1cmEtZGVmYXVsdC1yb2xlXCI6XCJ1c2VyXCIsXCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzXCI6W1widXNlclwiXX0iLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJjb2duaXRvOnVzZXJuYW1lIjoiR29vZ2xlXzEwOTQ5Mzg4NzI4ODYwODYwNjgzMyIsInBpY3R1cmUiOiJodHRwczpcL1wvbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbVwvYVwvQUNnOG9jS3psbjNrcnpzc3c4cDUzeWpHeG04TkFtSDNQd0d2Smd2ejMtNUMxTm1tZGRObnJRPXM5Ni1jIiwib3JpZ2luX2p0aSI6ImNkOTQ5NGI3LTYwNWQtNDVlYS04MzgyLTYwOGI0OTBkZTA5YyIsImF1ZCI6IjdkNzdwMWpsNzRvOGR0ZXJybWtpcHNkNmM3IiwiY2hhdF9vcmdfYXBpa2V5IjoiIGYxZmE0YzZhMWM1OWQ5MzEyOGZlOTE5ZTk0YTViOTFiZDExZWRlN2I2MzI5N2EyYzdiMWI4NTdmZjBjMWUxMzYiLCJ0b2tlbl91c2UiOiJpZCIsIm5hbWUiOiJLYXdpbktMIFJSIn0.myXjBY7J6w2RyF7aSLgmjoiLpagwXIkw5oYFmhNxFUwv2lSU5DplEHJUbGWKpfM4mF1xVotP2hqewIEtCDZNbuNVBA-XxmW4y9f9PEJcbJIhjhNmS1ecfvnFhCLfW8YNHQA4MU2LK_kik53D25zipoYUbPWEO3IgdrmabDKlKwgVS37F6KUWxtYyn74OCNOQY0hL0hd36Kxu6cmsawUzwaEMTd7mHfJK9uXA4vRiB6SmwJdubR0RfyeZ62EspawIlw0bIGrJtyWykrlto3kyH1Dy5UERhCrUAxCmfFPGPrp1m12x8jIDgazEJO5A9uoT1bN02xNBw_3WtzfKwOLt9g",
      videochat_org_name: "Tringhub",
      videochat_org_apikey: "10b2c71fcad3198d9682cd5bd35b40436d84611231b1543433c8021e6325393f"
  };
};
