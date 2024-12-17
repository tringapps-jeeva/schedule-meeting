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
import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react";
import { FormProvider, Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MeetingButton } from "./components/MeetingButton";
import { generateUUID, stringToColor } from "../../utils/helper";
import { GuestOption, MeetingData, MeetingFormData, MeetingType, schema } from "./types/CreateMeeting.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { customStyle } from "./styles/CreateMeeting";
import axios from "axios";

interface CreateMeetingProps {
  setMeetingCreated: Dispatch<SetStateAction<boolean>>;
}
const CreateMeeting: FC<CreateMeetingProps> = ({ setMeetingCreated }) => {
  const [meetingType, setMeetingType] = useState<MeetingType>("instant");
  const guestsData = useSelector((state: RootState) => state.guests)
  const [guests, setGuests] = useState<GuestOption[]>(guestsData);
  const [selectedGuests, setSelectedGuests] = useState<GuestOption[]>([]);
  const [meetingId, setMeetingId] = useState<string>("");
  const [extraCount, setExtraCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentUserDetails = useSelector((state: RootState) => state.organization.currentUser)
  const organizationDetails = useSelector((state: RootState) => state.organization.organization)
  const [participantError, setParticipantError] = useState<string | null>(null); // Local state for the error message
  const [tempSelectedGuests, setTempSelectedGuests] = useState<GuestOption[]>(
    []
  );

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
    setValue("description", "");
    setValue("date", undefined);
    setGuests(guests.map((guest) => ({ ...guest, selected: false })));
    setSelectedGuests([]);
    setParticipantError(null)
    setTempSelectedGuests([])
  };

  useEffect(() => {
    const visibleGuests = selectedGuests.slice(0, 5);
    const newExtraCount = selectedGuests.length - visibleGuests.length;
    setExtraCount(newExtraCount);
  }, [selectedGuests]);

  useEffect(() => {
    if (watch("date")) {
      setValue("startTime", dayjs().format("hh:mm A"));
      setValue("endTime", dayjs().add(1, "hour").format("hh:mm A"));
      trigger("startTime")
      trigger("endTime")
    }
  }, [trigger, setValue, watch("date")]);


  const renderAvatarGroup = useCallback(() => {
    if (selectedGuests.length === 0) {
      return <Typography>No Guests</Typography>;
    }

    const visibleGuests = selectedGuests.slice(0, 5);
    return (
      <AvatarGroup total={selectedGuests.length}>
        {visibleGuests.map((guest) => (
          <Avatar
            key={guest.emailId}
            sx={{
              bgcolor: stringToColor(guest.emailId),
              color: "#fff",
              width: 24,
              height: 24,
              fontSize: "10px",
            }}
          >
            {guest.emailId.charAt(0).toUpperCase()}
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


  const onSubmit = async (data: MeetingFormData) => {
    if (selectedGuests.length === 0) {
      setParticipantError("Please select at least one guest before submitting the meeting.");
      return;
    }
    setParticipantError(null);
    const {
      date,
      startTime,
      endTime,
      description,
      meetingTitle,
    } = data;
    const formattedDate = date ? moment(date).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
    const resetGuests = guests.map((guest) => ({ ...guest, selected: false }));
    const meetingData: MeetingData = {
      title: meetingTitle,
      description: description,
      type: "SCHEDULE",
      startTime: moment(`${formattedDate} ${startTime}`).toISOString(),
      endTime: moment(`${formattedDate} ${endTime}`).toISOString(),
      hostId: currentUserDetails?.externalUserId!,
      participants: selectedGuests.map(({ selected, ...rest }) => rest),
      organizationId: organizationDetails.organizationId,
    };
    const url = "https://3opcuaygu6.execute-api.ap-south-1.amazonaws.com/development/meeting/create";
    try {
      const response = await axios.post(url, meetingData);
      alert(response.data.message)
      reset();
      setValue("startTime", "");
      setValue("endTime", "");
      setValue("meetingTitle", "");
      setSelectedGuests([]);
      setGuests(resetGuests)
      setMeetingCreated(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error creating meeting:", error.response.data.message);
          alert(error.response.data.message)
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }

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

  useEffect(() => {
    if (participantError) {
      if (selectedGuests.length === 0) {
        setParticipantError("Please select at least one guest before submitting the meeting.");
      } else {
        setParticipantError(null);
      }
    }
  }, [selectedGuests, participantError]);




  // Handle guest selection in the autocomplete
  const handleSelectGuest = (event: any, value: GuestOption | null) => {
    if (!value) return;
    const updatedGuests = guests.map((guest) =>
      guest.emailId === value.emailId
        ? { ...guest, selected: !guest.selected }
        : guest
    );
    const updatedTempSelectedGuests = updatedGuests.filter(
      (guest) => guest.selected
    );
    setGuests(updatedGuests);
    setTempSelectedGuests(updatedTempSelectedGuests);
  };

  // Submit button handler
  const handleSubmitGuest = () => {
    setSelectedGuests(tempSelectedGuests);
    handleCloseDialog()
  };

  // Clear button handler
  const handleClearAll = () => {
    const resetGuests = guests.map((guest) => ({ ...guest, selected: false }));
    setGuests(resetGuests);
    setTempSelectedGuests([]);
    setSelectedGuests([]);
  };

  // Handle deleting a guest chip
  const handleDeleteGuest = (emailId: string) => {
    const updatedGuests = guests.map((guest) =>
      guest.emailId === emailId ? { ...guest, selected: false } : guest
    );
    const updatedTempSelectedGuests = updatedGuests.filter(
      (guest) => guest.selected
    );
    setGuests(updatedGuests);
    setTempSelectedGuests(updatedTempSelectedGuests);
  };



  console.log(errors)
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
              <div>
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
                    </>
                  )}
                />
              </div>
              {errors.description && (
                <div className="error-message">
                  {errors.description.message}
                </div>
              )}
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
              <>
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
              </>
              {participantError && (
                <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                  {participantError}
                </div>
              )}
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

        <DialogContent style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Guest selection */}
          <div>
            <Typography>Add email IDs of guests:</Typography>
            <Autocomplete
              options={guests}
              getOptionLabel={(option) => option.emailId}
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
                  {option.emailId}
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
                      border: "none",
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
                option.emailId === value.emailId
              }
            />
          </div>

          {/* Selected guests */}
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
              {tempSelectedGuests.length > 0 ? (
                tempSelectedGuests.map((guest) => (
                  <Chip
                    key={guest.emailId}
                    label={guest.emailId}
                    onDelete={() => handleDeleteGuest(guest.emailId)}
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
          <Button
            onClick={handleSubmitGuest}
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
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateMeeting;
