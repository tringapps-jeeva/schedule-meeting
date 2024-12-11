import React from "react";
import { Button } from "@mui/material";

export const MeetingButton = ({
  type,
  currentType,
  onClick,
  label
}: {
  type: string;
  currentType: string;
  onClick: any;
  label: string;
}) => {
  const isActive = type === currentType;

  return (
    <Button
      sx={{
        backgroundColor: isActive ? "#4A98F8 !important" : "white",
        fontFamily:'inherit !important',
        textTransform : 'capitalize !important',
        fontWeight : 400
      }}
      variant={isActive ? "contained" : "outlined"}
      disableRipple
      disableElevation
      onClick={() => onClick(type)}
    >
      {label}
    </Button>
  );
};