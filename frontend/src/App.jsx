import { BrowserRouter } from "react-router-dom";
import { Suspense, useLayoutEffect } from "react";
import AppRouter from "./app/router.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import ChatbotWidget from "./features/chatbot/ChatbotWidget.jsx";
import ThemeProvider from "./theme/ThemeProvider.jsx";
import StandaloneThemeControl from "./theme/StandaloneThemeControl.jsx";
import PageLoadingScreen from "./components/feedback/PageLoadingScreen.jsx";

export default function App() {
  useLayoutEffect(() => {
    window.dispatchEvent(new Event("miu:app-ready"));
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <StandaloneThemeControl />
          <Suspense fallback={<PageLoadingScreen />}>
            <AppRouter />
          </Suspense>
          <ChatbotWidget />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
