import { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import ChatPage from "./pages/ChatPage";

function App() {
  const [mode, setMode] = useState("dark"); // default is dark

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleMode = () => setMode((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatPage mode={mode} toggleMode={toggleMode} />
    </ThemeProvider>
  );
}

export default App;