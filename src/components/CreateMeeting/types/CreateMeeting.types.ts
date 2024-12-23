import * as Yup from "yup";
import moment from 'moment';


export type MeetingType = "instant" | "scheduled";

export interface GuestOption {
  externalUserId : string
  emailId: string;
  selected: boolean;
  userName : string
}

export interface MeetingFormData {
  meetingTitle: string;  
  description: string;  
  date?: Date;           
  startTime?: string;    
  endTime?: string;      
}

export const schema = Yup.object().shape({
  meetingTitle: Yup.string().required("Meeting title is required"),
  description: Yup.string().required("Meeting Description is required"),
  date: Yup.date().when("$meetingType", {
    is: "scheduled",
    then: (schema) =>
      schema
        .required("Date is required")
        .test(
          "isValidDate",
          "Date must be a valid date",
          (value) => moment(value).isValid()
        ),
    otherwise: (schema) => schema.nullable(),
  }),
  startTime: Yup.string().when("$meetingType", {
    is: "scheduled",
    then: (schema) =>
      schema.required("Start time is required"),
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
            if (!startTime) return true;

            // Use moment to compare startTime and endTime
            const start = moment(startTime, ["hh:mm A", "HH:mm"]); // Support both 12-hour and 24-hour formats
            const end = moment(value, ["hh:mm A", "HH:mm"]); // Support both 12-hour and 24-hour formats

            // If endTime is before startTime, show the error
            return end.isAfter(start);
          }
        ),
    otherwise: (schema) => schema.nullable(),
  }),
});

interface Participant {
  externalUserId: string;
  userName: string;
  emailId: string;
}

export interface MeetingData {
  title: string;
  description: string;
  type: "SCHEDULE" | "OTHER"; // Adjust the type based on possible values
  startTime: string;
  endTime: string;
  hostId: string;
  participants: Participant[];
  organizationId: string;
}
