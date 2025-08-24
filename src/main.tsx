import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css";
import App from "./App.tsx";
import { SessionProvider } from "./context/SessionContext.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp.tsx";
import SignIn from "./pages/SignIn.tsx";
import Welcome from "./pages/Welcome.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/welcome" element={<Welcome />} />
       

            <Route path="/" element={<Navigate to="/signin" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SessionProvider>
  </StrictMode>
);
