import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useRef, useState } from "react";
import { CreateUserRequest, CreateUserResponse, currentUserDetailsfromFrontend, getHeaders, MeetingResponse, OrganizationResponse, TokenRequest, UserDetailsResponse } from "../../App.types";
import { setCurrentUserDetails, setOrganization } from "../../redux/slices/OrganizationandUser";
import axios from "axios";
import { setMeetings } from "../../redux/slices/meetingsSlice";
import { Backdrop, CircularProgress } from "@mui/material";
import CreateMeeting from "../../components/CreateMeeting/CreateMeeting";
import JoinMeeting from "../../components/JoinMeeting/JoinMeeting";
import "./TringMeetLobby.css"
// import { TringVideoConference } from "@tringappsresearchlabs/tring-meet-web";


const TringMeetLobby = () => {
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
  const headers = getHeaders()

  // Fetch Organization API
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (isOrganizationFetched || tokenisEffectRun.current) return;
      tokenisEffectRun.current = true;
      setIsFetchingOrganization(true);
      const url =
        "https://3opcuaygu6.execute-api.ap-south-1.amazonaws.com/development/organization/token";
      const payload: TokenRequest = {
        token: "10b2c71fcad3198d9682cd5bd35b40436d84611231b1543433c8021e6325393f",
      };
      try {
        const response = await axios.post<OrganizationResponse>(url, payload, {headers});
        dispatch(setOrganization(response.data.organization));
        setIsOrganizationFetched(true);
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setIsFetchingOrganization(false);
      }
    };
    fetchData();
  }, [dispatch, headers, isOrganizationFetched]);

  // Create User API
  useEffect(() => {
    const createUser = async (): Promise<void> => {
      if (isUserCreated || !organizationDetails.organizationId || isEffectRun.current) return;
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
        await axios.post<CreateUserResponse>(userCreateUrl, userPayload, {headers});
        const currentUserDetailsUrl = `https://3opcuaygu6.execute-api.ap-south-1.amazonaws.com/development/user/${currentUserDetailsfromFrontend.externalUserId}`;
        const currentUserDetailsResponse = await axios.get<UserDetailsResponse>(currentUserDetailsUrl,{headers});
        dispatch(setCurrentUserDetails(currentUserDetailsResponse.data));
        setIsUserCreated(true);
      } catch (error) {
        console.error("Error creating user:", error);
      } finally {
        setIsCreatingUser(false);
      }
    };

    createUser();
  }, [organizationDetails.organizationId, isUserCreated, dispatch, organizationDetails, headers]);

  // Fetch Meetings API
  useEffect(() => {
    const fetchMeetingDetails = async () => {
      if (!currentUserDetails) return;
      setIsFetchingMeetings(true);
      try {
        const apiUrl = `https://3opcuaygu6.execute-api.ap-south-1.amazonaws.com/development/meetings/${currentUserDetails.externalUserId}`;
        const response = await axios.get<MeetingResponse[]>(apiUrl, {headers});
        const meetingsData = Array.isArray(response.data) ? response.data : [response.data];
        dispatch(setMeetings(meetingsData));
        setMeetingCreated(false);
        setIsMeetingDetailsFetched(true);
      } catch (err) {
        console.error("Error fetching meetings:", err);
        setIsFetchingMeetings(false);
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
  }, [currentUserDetails, isMeetingDetailsFetched, isMeetingCreated, dispatch, headers]);

  const handleMeetingCreated = () => {
    alert("Meeting created")
  }
  return (
    <div className="tring-meeting-lobby">
      <Backdrop open={isFetchingOrganization || isCreatingUser} style={{ zIndex: 1200, color: '#fff' }}>
        <CircularProgress color="primary" />
      </Backdrop>

      <CreateMeeting setMeetingCreated={setMeetingCreated} />
      <JoinMeeting loader={isFetchingMeetings} />
    </div>
    // <TringVideoConference isMeetingCreated={handleMeetingCreated}/>
  )
}

export default TringMeetLobby