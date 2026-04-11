import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#d4956a",
        light: "#e3b08a",
        dark: "#b8764e",
      },
      background: {
        default: isLight ? "#f5f4ef" : "#212121",
        paper: isLight ? "#ffffff" : "#2a2a2a",
      },
      text: {
        primary: isLight ? "#1a1a1a" : "#ececec",
        secondary: isLight ? "#666666" : "#9a9a9a",
      },
      divider: isLight ? "#e0ddd8" : "#2e2e2e",
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      body1: { lineHeight: 1.75 },
      body2: { lineHeight: 1.6 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 500 },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: { borderRadius: "8px" },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          "*": { boxSizing: "border-box" },
          body: { margin: 0 },
          "::-webkit-scrollbar": { width: "6px" },
          "::-webkit-scrollbar-track": { background: "transparent" },
          "::-webkit-scrollbar-thumb": {
            background: isLight ? "#d0cdc8" : "#3a3a3a",
            borderRadius: "3px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            background: isLight ? "#b0ada8" : "#4a4a4a",
          },
        },
      },
    },
  });
};

// Keep default dark export so nothing else breaks
export default getTheme("dark");