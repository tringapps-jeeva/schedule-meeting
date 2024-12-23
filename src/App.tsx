import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TringMeetLobby from "./pages/TringMeetLobby/TringMeetLobby";
import TringMeeting from "./pages/TringMeet/TringMeet";
import { TringVideoConference } from "@tringappsresearchlabs/tring-meet-web";
// import { TringVideoConference } from '@tringappsresearchlabs/tring-meet-web';

const App = () => {
  const handleMeetingCreated = () => {
    alert("Meeting created");
  };

  const Participant = [{
    userName: "Jeeva",
    externalUserId: "participant-id",
    emailId: "jeeva.j@tringapps.com",
  }];

  const CreateUserRequest = {
    externalUserId: "jeeva-id",
    userName: "external-user",
    emailId: "externalUser@mailinator.com",
    avatarUrl: "",
  };
  
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<TringMeetLobby />} />
    //     <Route path="meeting/:meetingId" element={<TringMeeting />} />
    //     <Route
    //       path="*"
    //       element={<h1 className="not-found">Page Not Found!</h1>}
    //     />
    //   </Routes>
    // </Router>
    <TringVideoConference
      onSuccess={()=>{}}
      onError={()=>{}}
      token="eyJraWQiOiJERmdxaERNN0pRT2VXWlRQdyt4UnRoRVA3UHN4bDFcL1VmNTZSR3YxNVBSOD0iLCJhbGciOiJSUzI1NiJ9.eyJ2aWRlb2NoYXRfb3JnX2FwaWtleSI6IjEwYjJjNzFmY2FkMzE5OGQ5NjgyY2Q1YmQzNWI0MDQzNmQ4NDYxMTIzMWIxNTQzNDMzYzgwMjFlNjMyNTM5M2YiLCJzdWIiOiI2NWVhMDlkOC0zMmMwLTQyMTQtYjA0Mi0wZTk0NzY4M2FmMzciLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaHR0cHM6XC9cL2hhc3VyYS5pb1wvand0XC9jbGFpbXMiOiJ7XCJ4LWhhc3VyYS11c2VyLWlkXCI6XCI2NWVhMDlkOC0zMmMwLTQyMTQtYjA0Mi0wZTk0NzY4M2FmMzdcIixcIngtaGFzdXJhLWRlZmF1bHQtcm9sZVwiOlwiYWRtaW5cIixcIngtaGFzdXJhLWFsbG93ZWQtcm9sZXNcIjpbXCJ1c2VyXCIsXCJhZG1pblwiXX0iLCJjaGF0X29yZ19uYW1lIjoiVHJpbmdodWIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX3F6OWh2Q2c1SCIsImNvZ25pdG86dXNlcm5hbWUiOiI2NWVhMDlkOC0zMmMwLTQyMTQtYjA0Mi0wZTk0NzY4M2FmMzciLCJvcmlnaW5fanRpIjoiZDQ2YjBkZDktNDEwYi00MjI2LTlmNTItZTk2NDdlNDQwZjU0IiwiYXVkIjoiN2Q3N3Axamw3NG84ZHRlcnJta2lwc2Q2YzciLCJldmVudF9pZCI6IjY3NzUwNGFlLWUzNDEtNDM3Ni1iZDlkLWVmNmRmMzcxZGVlZCIsImNoYXRfb3JnX2FwaWtleSI6ImYxZmE0YzZhMWM1OWQ5MzEyOGZlOTE5ZTk0YTViOTFiZDExZWRlN2I2MzI5N2EyYzdiMWI4NTdmZjBjMWUxMzYiLCJ0b2tlbl91c2UiOiJpZCIsInZpZGVvY2hhdF9vcmdfbmFtZSI6IlRyaW5naHViIiwiYXV0aF90aW1lIjoxNzM0OTMwODgyLCJuYW1lIjoiU3VwZXJhZG1pbiIsImV4cCI6MTczNDkzNDQ4MSwiaWF0IjoxNzM0OTMwODgyLCJqdGkiOiJiYTljZThiNC0zMTQ3LTQzYzctYjJjOS1mOWM2NGExNWZiMDkiLCJlbWFpbCI6InN1cGVyYWRtaW5AdHJpbmdodWIuY29tIn0.ADR2gih8JuwaurOMlVk-fzaPCzAT-mlwc1TfSmc_v4iREUFipU_h52D-ovbFwFkk7BqBIhg5-6XFVS0U963vazseCp6UKNKwXQwjDxiPNWi9YbbTUjrktMV-AD6dWWkEHBBE9zN3P2wq8jQVDIZIkOaO17qmmcOonS6nkSzMMRwp2u-odzx7PGAiEeyl7Ppz9bRd0LJHhrNvqIbb3fNkzXtYbgx7C8661FfeQxd0ds8g3OLM0K6D939ARVFSQQIr6FXSO4hQs9Fw6RLP-r2QQ_0S0OiG4Dc3m2uG23koAuLSjhicO0l9xEJvWcCIaB6xeKN0e-6oLpeDjpjhPCnGqw"
      appId="10b2c71fcad3198d9682cd5bd35b40436d84611231b1543433c8021e6325393f"
      userDetails={CreateUserRequest}
      participants={Participant}
    />
  );
};

export default App;
