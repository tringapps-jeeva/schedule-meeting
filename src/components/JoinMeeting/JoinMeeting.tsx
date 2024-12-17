import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FC, useState } from "react";
import moment, { Moment } from "moment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import { useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { RootState } from "../../redux/store";
import { formatDateForHeading, formatDateForMeetingsKey } from "../../utils/helper";
import { Meeting } from "../../redux/slices/meetingsSlice";

interface JoinMeetingProps {
  loader: boolean
}
const JoinMeeting: FC<JoinMeetingProps> = ({ loader }) => {
  const [openModal, setOpenModal] = useState(false);
  const meetings = useSelector((state: RootState) => state.meetings.meetingsByDate);
  const [value, onChange] = useState<Moment | null>(moment());
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const meetingsForDate =
    value && meetings[formatDateForMeetingsKey(value)]
      ? meetings[formatDateForMeetingsKey(value)]
      : [];

  const JoinMeeting = (id: string) => {
    window.location.href = `https://dev-hub.tringbytes.com/meeting/${id}`;
  };

  const handleCalendarChange = (date: any) => {
    setOpenModal(false);
    if (Array.isArray(date)) {
      onChange(moment(date[0]));
    } else {
      onChange(moment(date));
    }
  };

  const meetingDates = new Set(
    Object.keys(meetings).map((date) => new Date(date).toDateString())
  );

  // Conditionally render content based on the presence of meetings data
  const isMeetingsDataLoaded = Object.keys(meetings).length > 0;

  return (
    <div className="join-meeting">
      <p className="title-meeting">Upcoming meetings</p>

      {loader || !isMeetingsDataLoaded ? (
        <CircularProgress
          color="primary"
          style={{
            position: "absolute",
            top: "50%",
            left: "45%",
          }}
        />
      ) : (
        <>
          <div className="header">
            <div className="date">{formatDateForHeading(value || moment())}</div>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{ fontSize: "18px", cursor: "pointer" }}
                onClick={handleOpenModal} // Open the modal
              >
                <CalendarMonthIcon sx={{ color: "#4A98F8 !important" }} />
              </div>
            </div>
          </div>

          <div className="meetings-div">
            {meetingsForDate.length > 0 ? (
              meetingsForDate.map((meeting: Meeting) => (
                <div key={meeting.id} className="meeting-card">
                  <div className="outer-div">
                    <div className="title">{meeting.title}</div>
                    <div className="time">
                      <div>
                        <AccessTimeIcon
                          sx={{
                            fontSize: "17px",
                            position: "relative",
                            bottom: "1px",
                          }}
                        />
                      </div>
                      <div>{meeting.time}</div>
                      <div>
                        <VideocamOutlinedIcon
                          sx={{ fontSize: "19px", color: "#4A98F8 !important" }}
                        />
                      </div>
                    </div>
                    <div className="host">{meeting.participant}</div>
                  </div>
                  <div>
                    <Button
                      sx={{
                        fontFamily: "inherit !important",
                        textTransform: "capitalize !important",
                        fontWeight: 400,
                      }}
                      variant="outlined"
                      disableRipple
                      disableElevation
                      onClick={() => JoinMeeting(meeting.meetId)}
                      disabled={meeting.serverUrl ? false : true}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ marginTop: "50px", textAlign: "center" }}>
                No meetings scheduled for this date.
              </p>
            )}
          </div>
        </>
      )}

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Select Date</DialogTitle>
        <DialogContent>
          <Calendar
            onChange={handleCalendarChange}
            minDate={new Date()}
            value={value ? value.toDate() : new Date()}
            tileClassName={({ date, view }) =>
              view === "month" && meetingDates.has(date.toDateString())
                ? "highlight"
                : null
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinMeeting;
