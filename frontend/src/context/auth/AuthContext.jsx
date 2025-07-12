import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "./context";

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        isAuthenticated: false,
        user: null,
    });
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = async function () {
        try {
            const res = await axiosInstance.post(
                "/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            );
            if (res.data.status === "success") {
                toast(res.data.message);
                setUser({
                    isAuthenticated: false,
                    user: null,
                });
                navigate("/auth");
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                    try {
                        await axiosInstance.get("/auth/logout", {
                            withCredentials: true,
                        });
                    } catch (err) {
                        console.error("Logout failed:", err.message);
                    }

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
                setUser,
                isLoading,
                authUser,
                handleLogout,
            }}
        >
            {isLoading ? <Skeleton /> : children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
