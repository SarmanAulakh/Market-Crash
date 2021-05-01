export default {
  palette: {
    primary: {
      main: "#0073B6",  //blue
      light: "",
      dark: "",
      contrastText: ""
    },
    secondary: {
      main: "#D2042D",  //orange
      light: "",
      dark: "",
      contrastText: ""
    }
  },
  global: {
    typography: {
      useNextVariants: true,
    },
    form: {
      textAlign: "center",
    },
    image: {
      margin: "20px auto 20px auto",
    },
    pageTitle: {
      margin: "10px auto 10px auto",
    },
    textField: {
      margin: "10px auto 10px auto",
    },
    button: {
      marginTop: 20,
      position: "relative",
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: 10,
    },
    progress: {
      position: "absolute",
    },
    invisibleSeparator: {
      border: "none",
      margin: 4,
    },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      marginBottom: 20,
    },
    paper: {
      padding: 20,
    },
    profileImg: {
      width: 40,
      height: 40,
      objectFit: "cover",
      borderRadius: "50%",
    },
    profile: {
      "& .image-wrapper": {
        display: "flex",
        flexWrap: "nowrap",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "110px",
          left: "120px"
        },
      },
      "& .content-wrapper": {
        display: "flex",
        flexWrap: "nowrap",
        paddingLeft: 20, 
        justifyContent: "space-between",
        width: "100%"
      },
      "& .profile-image": {
        width: 150,
        height: 150,
        objectFit: "cover",
        minWidth: "150px",
        borderRadius: "50%",
      },
      "& .profile-details": {
         textAlign: "center",
        "& span, svg": {
          verticalAlign: "middle",
        },
        "& a": {
          color: "#00bcd4",
        },
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0",
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px",
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
};

/**
 * Yellow: #FFCE35
 * Pink: #FEBEBE
 * Purple: #3B55D9
 * 
 */