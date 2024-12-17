import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import CreateMeeting from './components/CreateMeeting/CreateMeeting';
import JoinMeeting from './components/JoinMeeting/JoinMeeting';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { setOrganization, setCurrentUserDetails } from './redux/slices/OrganizationandUser';
import { CreateUserRequest, CreateUserResponse, currentUserDetailsfromFrontend, MeetingResponse, OrganizationResponse, TokenRequest, UserDetailsResponse } from './App.types';
import { RootState } from './redux/store';
import { setMeetings } from './redux/slices/meetingsSlice';
import { Backdrop, CircularProgress } from '@mui/material';

function App() {
  const dispatch = useDispatch();
  const organizationDetails = useSelector((state: RootState) => state.organization.organization);
  const currentUserDetails = useSelector((state: RootState) => state.organization.currentUser);
  const isEffectRun = useRef(false);
  const tokenisEffectRun = useRef(false);

  const [isOrganizationFetched, setIsOrganizationFetched] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [isMeetingDetailsFetched, setIsMeetingDetailsFetched] = useState(false);
  const [isMeetingCreated, setMeetingCreated] = useState<boolean>(false);

  // Loader states
  const [isFetchingOrganization, setIsFetchingOrganization] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);

  // Fetch Organization API
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (isOrganizationFetched || tokenisEffectRun.current) return;
      tokenisEffectRun.current = true;
      setIsFetchingOrganization(true);
      const url =
        "https://3opcuaygu6.execute-api.ap-south-1.amazonaws.com/development/organization/token";
      const payload: TokenRequest = {
        token: "caae14d272657719c6d9cca1dca8b83d0a7aaf9735bf1b1d7bd408d36be357e3",
      };
      try {
        const response = await axios.post<OrganizationResponse>(url, payload);
        dispatch(setOrganization(response.data.organization));
        setIsOrganizationFetched(true);
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setIsFetchingOrganization(false);
      }
    };
    fetchData();
  }, [dispatch, isOrganizationFetched]);

  // Create User API
  useEffect(() => {
    const createUser = async (): Promise<void> => {
      if (isUserCreated || !organizationDetails || isEffectRun.current) return;
      isEffectRun.current = true;
      setIsCreatingUser(true);
      const userCreateUrl =
        "https://3opcuaygu6.execute-api.ap-south-1.amazonaws.com/development/user/create";

      const userPayload: CreateUserRequest = {
        externalUserId: currentUserDetailsfromFrontend.externalUserId,
        userName: currentUserDetailsfromFrontend.userName,
        emailId: currentUserDetailsfromFrontend.emailId,
        avatarUrl: currentUserDetailsfromFrontend.avatarUrl,
        organizationId: organizationDetails.organizationId,
      };
      try {
        await axios.post<CreateUserResponse>(userCreateUrl, userPayload);
        const currentUserDetailsUrl = `https://3opcuaygu6.execute-api.ap-south-1.amazonaws.com/development/user/${currentUserDetailsfromFrontend.externalUserId}`;
        const currentUserDetailsResponse = await axios.get<UserDetailsResponse>(currentUserDetailsUrl);
        dispatch(setCurrentUserDetails(currentUserDetailsResponse.data));
        setIsUserCreated(true);
      } catch (error) {
        console.error("Error creating user:", error);
      } finally {
        setIsCreatingUser(false);
      }
    };

    createUser();
  }, [organizationDetails, isUserCreated, dispatch]);

  // Fetch Meetings API
  useEffect(() => {
    const fetchMeetingDetails = async () => {
      if (!currentUserDetails) return;
      setIsFetchingMeetings(true);
      try {
        const apiUrl = `https://3opcuaygu6.execute-api.ap-south-1.amazonaws.com/development/meetings/${currentUserDetails.externalUserId}`;
        const response = await axios.get<MeetingResponse[]>(apiUrl);
        const meetingsData = Array.isArray(response.data) ? response.data : [response.data];
        dispatch(setMeetings(meetingsData));
        setMeetingCreated(false);
        setIsMeetingDetailsFetched(true);
      } catch (err) {
        console.error("Error fetching meetings:", err);
      } finally {
        setIsFetchingMeetings(false);
      }
    };

    if (!isMeetingDetailsFetched && currentUserDetails) {
      fetchMeetingDetails();
    }
    if (isMeetingCreated && currentUserDetails) {
      fetchMeetingDetails();
    }
  }, [currentUserDetails, isMeetingDetailsFetched, isMeetingCreated, dispatch]);

  return (
    <div className="tring-meeting-lobby">
      <Backdrop open={isFetchingOrganization || isCreatingUser} style={{ zIndex: 1200, color: '#fff' }}>
        <CircularProgress color="primary" />
      </Backdrop>

      <CreateMeeting setMeetingCreated={setMeetingCreated} />
      <JoinMeeting loader={isFetchingMeetings} />
      </div>
  );
}

export default App;
