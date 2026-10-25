import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/router.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import ChatbotWidget from "./features/chatbot/ChatbotWidget.jsx";
import ThemeProvider from "./theme/ThemeProvider.jsx";
import StandaloneThemeControl from "./theme/StandaloneThemeControl.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <StandaloneThemeControl />
          <AppRouter />
          <ChatbotWidget />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
