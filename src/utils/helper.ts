import moment, { Moment } from "moment";

export const stringToColor = (string: string): string => {
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

  export const formatDateForMeetingsKey = (date: Moment): string => {
    return date.format("YYYY-MM-DD");
  };

  export const formatDateForHeading = (date: Moment): string => {
    // If the selected date is today, show "Today"
    if (date.isSame(moment(), "day")) {
      return "Today";
    }
    return date.format("MMMM D, YYYY");
  };

  export const disablePastDates = (current: Moment) => {
    return current.isBefore(moment(), "day"); // Disable dates before today
  };

  export const generateUUID = () => {
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
    window.location.href = `https://dev-hub.tringbytes.com/meeting/${uuid}`;
  };