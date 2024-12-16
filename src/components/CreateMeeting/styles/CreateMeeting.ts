export const customStyle = {
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