import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import AuthProvider from "./context/auth/AuthContext";
import InstructorProvider from "./context/instructor/InstructorContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <InstructorProvider>
                    <App />
                </InstructorProvider>
            </AuthProvider>
        </BrowserRouter>
        <Toaster />
    </StrictMode>
);
