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
import { DatePicker } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider, Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { MeetingButton } from "./components/MeetingButton";
import moment, { Moment } from "moment";
import {  setMeetings } from "../../redux/slices/meetingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";

type MeetingType = "instant" | "scheduled";
interface GuestOption {
  email: string;
  selected: boolean;
}
const guestsData: GuestOption[] = [
  { email: "john.doe@example.com", selected: false },
  { email: "jane.doe@example.com", selected: false },
  { email: "guest1@example.com", selected: false },
  { email: "guest2@example.com", selected: false },
  { email: "mike.smith@example.com", selected: false },
  { email: "sarah.connor@example.com", selected: false },
  { email: "emma.brown@example.com", selected: false },
  { email: "oliver.jones@example.com", selected: false },
  { email: "ava.taylor@example.com", selected: false },
  { email: "william.johnson@example.com", selected: false },
  { email: "sophia.martin@example.com", selected: false },
  { email: "james.anderson@example.com", selected: false },
  { email: "mia.thompson@example.com", selected: false },
  { email: "charlotte.moore@example.com", selected: false },
  { email: "liam.walker@example.com", selected: false },
  { email: "isabella.white@example.com", selected: false },
  { email: "elijah.hall@example.com", selected: false },
  { email: "amelia.clark@example.com", selected: false },
  { email: "lucas.lewis@example.com", selected: false },
  { email: "harper.scott@example.com", selected: false },
];

const schema = Yup.object().shape({
  meetingTitle: Yup.string().required("Meeting title is required"),
  description: Yup.string(),
  startDate: Yup.date().when("$meetingType", {
    is: "scheduled",
    then: (schema) =>
      schema
        .required("Start date is required")
        .test(
          "isValidStartDate",
          "Start date must be before end date",
          function (value) {
            const { endDate } = this.parent;
            return !endDate || new Date(value) <= new Date(endDate);
          }
        ),
    otherwise: (schema) => schema.nullable(),
  }),
  endDate: Yup.date().when("$meetingType", {
    is: "scheduled",
    then: (schema) =>
      schema
        .required("End date is required")
        .test(
          "isValidEndDate",
          "End date must be after start date",
          function (value) {
            const { startDate } = this.parent;
            return !startDate || new Date(value) >= new Date(startDate);
          }
        ),
    otherwise: (schema) => schema.nullable(),
  }),
  startTime: Yup.string().when("$meetingType", {
    is: "scheduled",
    then: (schema) => schema.required("Start time is required"),
    // .test(
    //   "isValidStartTime",
    //   "Start time must be before end time",
    //   function (value) {
    //     const { endTime } = this.parent;
    //     return !endTime || value < endTime;
    //   }
    // ),
    otherwise: (schema) => schema.nullable(),
  }),
  endTime: Yup.string().when("$meetingType", {
    is: "scheduled",
    then: (schema) =>
      schema
        .required("End time is required")
        .test(
          "isValidEndTime",
          "End time must be after start time",
          function (value) {
            const { startTime } = this.parent;
            return !startTime || value > startTime;
          }
        ),
    otherwise: (schema) => schema.nullable(),
  }),
});

const customStyle = {
  "& .MuiInputBase-root": {
    backgroundColor: "white",
    width: "140px",
    height: "41px",
    outline: "none",
    border: "1px solid #e8e8e8",
    "&:focus": {
      outline: "none",
      border: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiInputBase-input::placeholder": {
      opacity: 1,
      color: "#616161",
      fontSize: "16px",
      fontWeight: 400,
      "&:focus": {
        fontSize: "16px",
        color: "#616161",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "16px",
      backgroundColor: "white",
      border: "none",
      height: "14.5px",
    },
    "& .MuiInputAdornment-root": {
      marginLeft: "0px",
      height: "41px",
      background: "transparent",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      opacity: 1,
      WebkitTextFillColor: "unset",
      color: "#616161",
    },
  },
};

const stringToColor = (string: string): string => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const CreateMeeting = () => {
  const [meetingType, setMeetingType] = useState<MeetingType>("instant");
  const [guests, setGuests] = useState<GuestOption[]>(guestsData);
  const [selectedGuests, setSelectedGuests] = useState<GuestOption[]>([]);
  const [startDate] = useState<any>();
  const [endDate] = useState<any>();
  const [extraCount, setExtraCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const meetings = useSelector((state: RootState) => state.meetings.meetings);

  const methods = useForm({
    resolver: yupResolver(schema),
    context: { meetingType },
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const handleMeetingTypeChange = (type: MeetingType) => {
    setMeetingType(type);
    reset();
    setValue("meetingTitle", "");
    const resetGuests = guests.map((guest) => ({ ...guest, selected: false }));
    setGuests(resetGuests);
    setSelectedGuests([]);
  };

  useEffect(() => {
    const visibleGuests = selectedGuests.slice(0, 5);
    const newExtraCount = selectedGuests.length - visibleGuests.length;
    setExtraCount(newExtraCount); // Update the extra count in state
  }, [selectedGuests]); // Dependency on selectedGuests to re-run when it changes

  useEffect(() => {
    setValue("startTime", dayjs().format("hh:mm A"));
    setValue("endTime", dayjs().add(1, "hour").format("hh:mm A"));
  }, [watch("startDate")]);

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

  const onSubmit = (data: any) => {
    const { startDate, endDate, startTime, endTime, description, meetingTitle } = data;
    const newMeeting = {
      id: Math.floor(Math.random() * 10000),  // Use a better unique ID in real applications
      title: meetingTitle,
      time: `${startTime} - ${endTime}`,
      participant: description,
    };
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    let newMeetings = JSON.parse(JSON.stringify(meetings));
    while (currentDate <= end) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      if (!newMeetings[formattedDate]) {
        newMeetings[formattedDate] = [];
      }
      newMeetings[formattedDate].push(newMeeting);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    dispatch(setMeetings(newMeetings));
    reset()
    setValue("meetingTitle", "");
  };
  

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

  const disablePastDates = (current: Moment) => {
    return current.isBefore(moment(), "day"); // Disable dates before today
  };

  return (
    <div className="create-meeting">
      <h1>Create Meeting</h1>
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
                      width: "75% !important",
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
                    className={`textArea ${
                      true ? "textAreaNonField" : "textAreaField"
                    }`}
                    {...field}
                    placeholder="Enter your description here"
                    rows={5}
                    cols={40}
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
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        {...field}
                        format={"MMM D, YYYY"}
                        placeholder="Start-Date"
                        value={field.value || startDate}
                        onChange={(newDate) => field.onChange(newDate)}
                        className="date"
                        disabledDate={disablePastDates}
                      />
                      {errors.startDate && (
                        <span className="error-message">
                          {errors.startDate.message}
                        </span>
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
                            dayjs(watch("startDate")).isSame(dayjs(), "day")
                              ? true
                              : false
                          }
                          disabled={watch("startDate") ? false : true}
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
                          minTime={dayjs(watch("startDate"))}
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

              {/* End Date */}
              <div className="endDate">
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        {...field}
                        format={"MMM D, YYYY"}
                        placeholder="End-Date"
                        value={field.value || endDate}
                        onChange={(newDate) => field.onChange(newDate)}
                        className="date"
                        disabledDate={disablePastDates}
                      />
                      {errors.endDate && (
                        <span className="error-message">
                          {errors.endDate.message}
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
