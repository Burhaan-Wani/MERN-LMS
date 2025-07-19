import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import AuthProvider from "./context/auth/AuthContext";
import InstructorProvider from "./context/instructor/InstructorContext";
import StudentProvider from "./context/student-context/StudentContext";

const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
};

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <InstructorProvider>
                    <StudentProvider>
                        <PayPalScriptProvider
                            // deferLoading={true}
                            options={initialOptions}
                        >
                            <App />
                        </PayPalScriptProvider>
                    </StudentProvider>
                </InstructorProvider>
            </AuthProvider>
        </BrowserRouter>
        <Toaster />
    </StrictMode>
);
