import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import moment from 'moment';


export type MeetingType = "instant" | "scheduled";

export interface GuestOption {
  email: string;
  selected: boolean;
}

export interface MeetingFormData {
  meetingTitle: string;  
  description?: string;  
  date?: Date;           
  startTime?: string;    
  endTime?: string;      
}

export const schema = Yup.object().shape({
  meetingTitle: Yup.string().required("Meeting title is required"),
  description: Yup.string(),
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
            const start = moment(startTime, "HH:mm");
            const end = moment(value, "HH:mm");

            // If endTime is before startTime, show the error
            return end.isAfter(start);
          }
        ),
    otherwise: (schema) => schema.nullable(),
  }),
});

