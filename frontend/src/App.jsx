import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import LoginForm from "./features/login/LoginForm";
import RegisterForm from "./features/login/RegisterForm";
import ProtectedRoute from "./pages/ProtectedRoute";
import ForgotPasswordForm from "./features/login/ForgotPasswordForm";
import { useAuth } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { WebsoketProvider } from "./contexts/WebsockerContext";

function App() {
  const { user: userId } = useAuth();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              <ProtectedRoute>
                <ChatProvider>
                  <WebsoketProvider>
                    <ChatPage />
                  </WebsoketProvider>
                </ChatProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="login"
            element={userId ? <Navigate replace to="/" /> : <LoginPage />}
          >
            <Route index element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
            <Route path="forgot_password" element={<ForgotPasswordForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
