import { AuthContext } from "./context";
import axiosInstance from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        isAuthenticated: false,
        user: null,
    });
    const [isLoading, setIsLoading] = useState(true);

    const authUser = useCallback(
        async function authUser() {
            try {
                const res = await axiosInstance.get("/auth/me", {
                    withCredentials: true,
                });
                if (res.data.status === "success") {
                    setUser({
                        isAuthenticated: true,
                        user: res.data.data.user,
                    });
                }
            } catch (error) {
                const msg = error.response?.data?.message;

                if (msg === "JWT_EXPIRED") {
                    setUser({ isAuthenticated: false, user: null });
                    if (location.pathname !== "/auth") {
                        toast("Session expired. Please log in again.");
                        navigate("/auth");
                    }
                } else {
                    setUser({ isAuthenticated: false, user: null });
                }
            } finally {
                setIsLoading(false); // <--- very important
            }
        },
        [navigate]
    );

    useEffect(() => {
        authUser();
    }, [authUser]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                authUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
