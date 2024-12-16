import {
  Avatar,
  AvatarGroup,
  TextField,
  Typography,
  Button,
  DialogActions,
  Autocomplete,
  IconButton,
  Dialog,
  DialogContent,
  Box,
  DialogTitle,
  Chip,
} from "@mui/material";
import { LocalizationProvider, DesktopTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider, Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import moment, { Moment } from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setMeetings } from "../../redux/slices/meetingsSlice";
import { MeetingButton } from "./components/MeetingButton";
import { generateUUID, stringToColor } from "../../utils/helper";
import { GuestOption, MeetingFormData, MeetingType, schema } from "./types/CreateMeeting.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { customStyle } from "./styles/CreateMeeting";

const CreateMeeting = () => {
  const [meetingType, setMeetingType] = useState<MeetingType>("instant");
  const guestsData = useSelector((state: RootState) => state.guests)
  const [guests, setGuests] = useState<GuestOption[]>(guestsData);
  const [selectedGuests, setSelectedGuests] = useState<GuestOption[]>([]);
  const [meetingId, setMeetingId] = useState<string>("");
  const [startDate, setStartDate] = useState<any>();
  const [extraCount, setExtraCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const meetings = useSelector((state: RootState) => state.meetings.meetings);

  const methods = useForm<MeetingFormData>({
    resolver: yupResolver(schema),
    context: { meetingType },
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = methods;

  const handleMeetingTypeChange = (type: MeetingType) => {
    setMeetingType(type);
    reset();
    setValue("meetingTitle", "");
    setValue("description", ""); // Reset description as well
    setValue("date", undefined); // Ensure start date is cleared
    setGuests(guests.map((guest) => ({ ...guest, selected: false })));
    setSelectedGuests([]);
  };

  useEffect(() => {
    const visibleGuests = selectedGuests.slice(0, 5);
    const newExtraCount = selectedGuests.length - visibleGuests.length;
    setExtraCount(newExtraCount); // Update the extra count in state
  }, [selectedGuests]); // Dependency on selectedGuests to re-run when it changes

  useEffect(() => {
    if (watch("date")) {
      setValue("startTime", dayjs().format("hh:mm A"));
      setValue("endTime", dayjs().add(1, "hour").format("hh:mm A"));
      trigger("startTime")
      trigger("endTime")
    }
  }, [watch("date"), trigger, setValue]);

  console.log(watch("startTime"), watch("endTime"),watch("date"), "timings")

  const renderAvatarGroup = useCallback(() => {
    if (selectedGuests.length === 0) {
      return <Typography>No Guests</Typography>;
    }

    const visibleGuests = selectedGuests.slice(0, 5);
    return (
      <AvatarGroup total={selectedGuests.length}>
        {visibleGuests.map((guest) => (
          <Avatar
            key={guest.email}
            sx={{
              bgcolor: stringToColor(guest.email),
              color: "#fff",
              width: 24,
              height: 24,
              fontSize: "10px",
            }}
          >
            {guest.email.charAt(0).toUpperCase()}
          </Avatar>
        ))}

        {/* Render extra count only if there are extra guests */}
        {extraCount > 0 && (
          <Avatar
            sx={{
              color: "#fff",
              width: 24,
              height: 24,
              fontSize: "10px",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                fontSize: "10px",
              }}
            >
              +{extraCount}
            </span>
          </Avatar>
        )}
      </AvatarGroup>
    );
  }, [extraCount, selectedGuests]);

  const generateMeetId = () => {
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
    return uuid;
  };

  console.log(errors, "errors")

  const onSubmit = (data: MeetingFormData) => {
    const {
      date, 
      startTime,
      endTime,
      description,
      meetingTitle,
    } = data;
  
    // Create a new meeting object
    const newMeeting = {
      id: Math.floor(Math.random() * 10000),
      title: meetingTitle,
      time: `${startTime} - ${endTime}`,
      participant: description,
      meetId: generateMeetId(),
    };
  
    const formattedDate = date
      ? moment(date).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");
  
    let newMeetings = JSON.parse(JSON.stringify(meetings));
  
    if (!newMeetings[formattedDate]) {
      newMeetings[formattedDate] = [];
    }
    newMeetings[formattedDate].push(newMeeting);
  
    dispatch(setMeetings(newMeetings));
  
    reset();
    setValue("startTime", "");
    setValue("endTime", "");
    setValue("meetingTitle", "");
    setSelectedGuests([]);
  };
  
  

  console.log(meetings, "meetings")

  const handleSelectGuest = (event: any, value: GuestOption | null) => {
    if (!value) return;
    const updatedGuests = guests.map((guest) =>
      guest.email === value.email
        ? { ...guest, selected: !guest.selected }
        : guest
    );
    const updatedSelectedGuests = updatedGuests.filter(
      (guest) => guest.selected
    );
    setGuests(updatedGuests);
    setSelectedGuests(updatedSelectedGuests);
  };

  const handleClearAll = () => {
    const resetGuests = guests.map((guest) => ({ ...guest, selected: false }));
    setGuests(resetGuests);
    setSelectedGuests([]);
  };

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);


  const JoinMeeting = () => {
    const regex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (regex.test(meetingId)) {
      window.location.href = `https://dev-hub.tringbytes.com/meeting/${meetingId}`;
    } else {
      alert("Invalid meeting ID!");
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="create-meeting">
      <p className="title-meeting">Create Meeting</p>
      <div className="meeting-type">
        <MeetingButton
          type="instant"
          currentType={meetingType}
          onClick={handleMeetingTypeChange}
          label="Instant Meeting"
        />
        <MeetingButton
          type="scheduled"
          currentType={meetingType}
          onClick={handleMeetingTypeChange}
          label="Scheduled Meeting"
        />
      </div>

      {meetingType === "instant" && (
        <div>
          <p className="instant-title">
            No scheduling required—jump straight into the meeting! &nbsp;
            <span className="underline-text" onClick={generateUUID}>
              Create Meeting
            </span>
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <TextField
              variant="outlined"
              // fullWidth
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              sx={{
                width: "40%",
                "& .MuiInputBase-input": {
                  borderRadius: "6px",
                  backgroundColor: "#f6f6f6",
                  height: "10px !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "none !important",
                  borderStyle: "none !important",
                  borderWidth: "0px !important",
                },
              }}
            />

            <Button
              variant="outlined"
              sx={{
                fontFamily: "inherit !important",
                textTransform: "capitalize !important",
                fontWeight: 400,
                width: 200,
              }}
              disableRipple
              disableElevation
              fullWidth
              type="submit"
              disabled={!meetingId}
              onClick={() => JoinMeeting()}
            >
              Join Meeting
            </Button>
          </div>
        </div>
      )}
      {meetingType === "scheduled" && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Meeting Title */}
            <div className="meeting-title">
              <Controller
                name="meetingTitle"
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      placeholder="Enter Meeting title"
                      variant="outlined"
                      fullWidth
                      sx={{
                        width: 700,
                        "& .MuiInputBase-input": {
                          borderRadius: "6px",
                          backgroundColor: "#f6f6f6",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderRadius: "none !important",
                          borderStyle: "none !important",
                          borderWidth: "0px !important",
                        },
                      }}
                      error={!!errors.meetingTitle} // Applies error styling
                    />
                    {errors.meetingTitle && (
                      <span className="error-message meeting-title-error">
                        {errors.meetingTitle.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            {/* Meeting Description */}
            <div className="meeting-description">
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <textarea
                      id="description"
                      className={`textArea ${true ? "textAreaNonField" : "textAreaField"
                        }`}
                      {...field}
                      placeholder="Enter your description here"
                      style={{ width: 700 }}
                    // rows={5}
                    // cols={40}
                    />
                    {errors.description && (
                      <span className="error-message">
                        {errors.description.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            {/* Meeting Date and Time */}
            {meetingType === "scheduled" && (
              <div className="meeting-time-date">


                {/* Start Date */}
                <div className="startDate">
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          type="date"
                          placeholder="Start-Date"
                          value={field.value ? field.value.toString().split("T")[0] : ""} // Ensures string format for date
                          className="date"
                          style={{ padding: 10 }}
                          onChange={(e) => field.onChange(e.target.value)} // Ensure `e.target.value` is passed
                          min={today} // Ensure `today` is in the format "YYYY-MM-DD"
                        />
                        {errors.date && (
                          <span className="error-message">{errors.date.message}</span>
                        )}
                      </>
                    )}
                  />
                </div>



                {/* Start Time */}
                <div className="startTime">
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopTimePicker
                            sx={customStyle}
                            {...field}
                            value={
                              field.value ? dayjs(field.value, "hh:mm A") : null
                            }
                            onChange={(newValue) =>
                              field.onChange(
                                newValue ? newValue.format("hh:mm A") : ""
                              )
                            }
                            format="hh:mm A"
                            timeSteps={{ minutes: 1 }}
                            slotProps={{
                              textField: {
                                placeholder: "00:00 AM",
                              },
                            }}
                            disablePast={
                              dayjs(watch("date")).isSame(dayjs(), "day")
                                ? true
                                : false
                            }
                            disabled={watch("date") ? false : true}
                          />
                        </LocalizationProvider>
                        {errors.startTime && (
                          <span className="error-message">
                            {errors.startTime.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </div>

                <div style={{ alignSelf: "center" }}>to</div>

                {/* End Time */}
                <div className="endTime">
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopTimePicker
                            sx={customStyle}
                            {...field}
                            value={
                              field.value ? dayjs(field.value, "hh:mm A") : null
                            }
                            onChange={(newValue) =>
                              field.onChange(
                                newValue ? newValue.format("hh:mm A") : ""
                              )
                            }
                            format="hh:mm A"
                            timeSteps={{ minutes: 1 }}
                            slotProps={{
                              textField: {
                                placeholder: "00:00 AM",
                              },
                            }}
                            minTime={dayjs(watch("date"))}
                          />
                        </LocalizationProvider>
                        {errors.endTime && (
                          <span className="error-message">
                            {errors.endTime.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Add Guest Button */}
            <div className="add-guest">
              <div className="avatar-div">{renderAvatarGroup()}</div>
              <Button
                variant="outlined"
                sx={{
                  fontFamily: "inherit !important",
                  textTransform: "capitalize !important",
                  fontWeight: 400,
                }}
                disableRipple
                disableElevation
                fullWidth
                onClick={handleOpenDialog}
              >
                Add Guest
              </Button>
            </div>

            {/* Create Button */}
            <div className="cta">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4A98F8 !important",
                  fontFamily: "inherit !important",
                  textTransform: "capitalize !important",
                  fontWeight: 400,
                }}
                disableRipple
                disableElevation
                fullWidth
                type="submit"
              >
                Create
              </Button>
            </div>
          </form>
        </FormProvider>
      )}

      <Dialog open={isDialogOpen} fullWidth>
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add Guests
          <IconButton onClick={handleCloseDialog} style={{ padding: 0 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <Typography>Add email IDs of guests:</Typography>
            <Autocomplete
              options={guests}
              getOptionLabel={(option) => option.email}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {option.email}
                  {option.selected && <CheckIcon color="primary" />}
                </Box>
              )}
              onChange={handleSelectGuest}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select email"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "none !important",
                      borderStyle: "none !important",
                      borderWidth: "0px !important",
                    },
                    "& .MuiOutlinedInput-root": {
                      border: "1px solid #ececec !important",
                    },
                  }}
                />
              )}
              sx={{
                "& .MuiAutocomplete-input ": {
                  backgroundColor: "white !important",
                },
              }}
              disableCloseOnSelect
              isOptionEqualToValue={(option, value) =>
                option.email === value.email
              }
            />
          </div>
          <div>
            <Typography>Selected Guests:</Typography>
            <Box
              sx={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ececec",
                padding: "10px",
                borderRadius: "4px",
                minHeight: "200px",
              }}
            >
              {selectedGuests.length > 0 ? (
                selectedGuests.map((guest) => (
                  <Chip
                    key={guest.email}
                    label={guest.email}
                    onDelete={() => {
                      const updatedGuests = guests.map((g) =>
                        g.email === guest.email ? { ...g, selected: false } : g
                      );
                      const updatedSelectedGuests = updatedGuests.filter(
                        (g) => g.selected
                      );
                      setGuests(updatedGuests);
                      setSelectedGuests(updatedSelectedGuests);
                    }}
                    sx={{
                      margin: "4px",
                      backgroundColor: "rgba(74, 152, 248, 0.5) !important",
                    }}
                  />
                ))
              ) : (
                <span style={{ color: "#a2a3a2" }}>No guests selected</span>
              )}
            </Box>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClearAll}
            sx={{
              backgroundColor: "#4A98F8 !important",
              fontFamily: "inherit !important",
              textTransform: "capitalize !important",
              fontWeight: 400,
            }}
            variant="contained"
            disableRipple
            disableElevation
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateMeeting;
