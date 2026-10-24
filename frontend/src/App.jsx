import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/router.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import ChatbotWidget from "./features/chatbot/ChatbotWidget.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <ChatbotWidget />
      </AuthProvider>
    </BrowserRouter>
  );
}
