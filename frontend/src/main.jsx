import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import AuthProvider from "./context/auth/AuthContext";
import InstructorProvider from "./context/instructor/InstructorContext";
import StudentProvider from "./context/student-context/StudentContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <InstructorProvider>
                    <StudentProvider>
                        <App />
                    </StudentProvider>
                </InstructorProvider>
            </AuthProvider>
        </BrowserRouter>
        <Toaster />
    </StrictMode>
);
