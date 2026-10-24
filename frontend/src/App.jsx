import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/router.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
