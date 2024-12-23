import React, { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { currentUserDetailsfromFrontend } from '../../App.types';
import { IJitsiMeetExternalApi } from '@jitsi/react-sdk/lib/types';
import { CircularProgress } from '@mui/material';
// import { TringMeet } from "@tringappsresearchlabs/tring-meet-web";


const jitsiServerURL = "d3csyw34sa8b0j.cloudfront.net";

const TringMeeting = () => {
    const { meetingId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const apiRef = useRef<IJitsiMeetExternalApi | null>(null);

    if (!meetingId) navigate("/");

    console.log("calling TringMeeting component", meetingId, jitsiServerURL)


    const handleApiReady = (apiObj: IJitsiMeetExternalApi) => {
        console.log(apiObj, "calling TringMeeting component")
        apiRef.current = apiObj;

        apiObj.on("videoConferenceJoined", () => {
            console.log("[Log] videoConferenceJoined");
            setLoading(false);
        });

        apiObj.on("videoConferenceLeft", () => {
            console.log("[Log] videoConferenceLeft");
            navigate("/meeting");
        });

        apiObj.on("toolbarButtonClicked", (object) => {
            console.log("tool bar clicked", object);
            if (object.key === "hangup") {
                apiObj?.executeCommand("hangup");
            }
        });
    };

    const handleMessageArrived = () => {
        console.log("message arrived")
    }

    return (
        <>
            {loading && <CircularProgress />}
            {/* <TringMeet
                domain={jitsiServerURL}
                roomName={meetingId!}
                enableTileView={false}
                activePanel={"chat"}
                filmStripPosition={"top"}
                screenShareFilmStripPosition={"top"}
                pinModerator={true}
                handleMessageArrived={handleMessageArrived}
                configOverwrite={{
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    buttonsWithNotifyClick: ["hangup"],
                    disablePolls: true,
                    disableModeratorIndicator: false,
                    participantsPane: {
                        hideModeratorSettingsTab: true,
                        hideMoreActionsButton: true,
                    },
                    disableTileView: true,
                    toolbarButtons: [
                        "microphone",
                        "camera",
                        "raisehand",
                        "desktop",
                        "hangup",
                    ],
                    disabledSounds: [
                        "ASKED_TO_UNMUTE_SOUND",
                        "E2EE_OFF_SOUND",
                        "E2EE_ON_SOUND",
                        "INCOMING_MSG_SOUND",
                        "KNOCKING_PARTICIPANT_SOUND",
                        "LIVE_STREAMING_OFF_SOUND",
                        "LIVE_STREAMING_ON_SOUND",
                        "NO_AUDIO_SIGNAL_SOUND",
                        "NOISY_AUDIO_INPUT_SOUND",
                        "OUTGOING_CALL_EXPIRED_SOUND",
                        "OUTGOING_CALL_REJECTED_SOUND",
                        "OUTGOING_CALL_RINGING_SOUND",
                        "OUTGOING_CALL_START_SOUND",
                        "PARTICIPANT_JOINED_SOUND",
                        "PARTICIPANT_LEFT_SOUND",
                        "RAISE_HAND_SOUND",
                        "REACTION_SOUND",
                        "RECORDING_OFF_SOUND",
                        "_ON_SOUND",
                        "TALK_WHILE_MUTED_SOUND",
                    ],
                    notifications: [],
                    prejoinConfig: {
                        enabled: false,
                    },
                }}
                userInfo={{
                    email: "",
                    avatarUrl: "",
                    displayName: currentUserDetailsfromFrontend.userName ?? "",
                }}
                onApiReady={handleApiReady}
            /> */}
        </>
    );

}

export default TringMeeting