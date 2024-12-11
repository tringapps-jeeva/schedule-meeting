import { DatePicker } from "antd";
import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import moment, { Moment } from "moment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


const JoinMeeting = () => {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment()); // Use Moment for date handling
  const [showCalendar, setShowCalendar] = useState(false);
  const meetings = useSelector((state: RootState) => state.meetings.meetings);


  const handleDateChange = (date: any) => {
    if (date) {
      setSelectedDate(date);
      setShowCalendar(false);
    }
  };

  const formatDateForMeetingsKey = (date: Moment): string => {
    return date.format("YYYY-MM-DD");
  };

  const formatDateForHeading = (date: Moment): string => {
    // If the selected date is today, show "Today"
    if (date.isSame(moment(), "day")) {
      return "Today";
    }
    return date.format("MMMM D, YYYY");
  };

  const disablePastDates = (current: Moment) => {
    return current.isBefore(moment(), "day"); // Disable dates before today
  };

  const calendarRef = useRef<HTMLDivElement | null>(null); // Ref for the calendar container

  const handleClickOutside = (event: MouseEvent) => {
    console.log("outside clicking");
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      // setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const meetingsForDate =
    selectedDate && meetings[formatDateForMeetingsKey(selectedDate)]
      ? meetings[formatDateForMeetingsKey(selectedDate)]
      : [];

  return (
    <div className="join-meeting">
      <h1>Upcoming meetings</h1>
      <div className="header">
        <div className="date">{formatDateForHeading(selectedDate)}</div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{ fontSize: "18px", cursor: "pointer" }}
            onClick={() => setShowCalendar(!showCalendar)}
            ref={calendarRef}
          >
            <CalendarMonthIcon sx={{ color: "#4A98F8 !important" }} />
          </div>
          {showCalendar && (
            <div
              style={{
                position: "absolute",
                zIndex: 1000,
                background: "white",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                borderRadius: "8px",
              }}
            >
              <DatePicker
                open={true}
                onChange={handleDateChange}
                value={selectedDate}
                style={{ visibility: "hidden", position: "absolute" }} // Hides the input field only
                popupStyle={{ marginTop: "-40px !important" }} // Proper spacing below the button
                popupClassName="calender-ant-picker"
                disabledDate={disablePastDates}
              />
            </div>
          )}
        </div>
      </div>

      <div className="meetings-div">
        {meetingsForDate.length > 0 ? (
          meetingsForDate.map((meeting) => (
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
    </div>
  );
};

export default JoinMeeting;
