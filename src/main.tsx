import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css";
import { SessionProvider } from "./context/SessionContext.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/auth/SignUp.tsx";
import SignIn from "./pages/auth/SignIn.tsx";
import { UsersProvider } from "./context/UsersContext.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import AuthGuard from "./guards/AuthGuard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/dashboard"
              element={
                <UsersProvider>
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                </UsersProvider>
              }
            />

            <Route path="/" element={<Navigate to="/signin" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SessionProvider>
  </StrictMode>
);
