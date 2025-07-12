import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ user, loading, children }) {
    const location = useLocation();
    if (loading) return null;

    if (!user.isAuthenticated && !location.pathname.includes("/auth")) {
        return <Navigate to="/auth" />;
    }

    if (
        user.isAuthenticated &&
        user?.user?.role !== "instructor" &&
        (location.pathname.includes("instructor") ||
            location.pathname.includes("/auth"))
    ) {
        return <Navigate to="/home" />;
    }

    if (
        user.isAuthenticated &&
        user?.user?.role === "instructor" &&
        !location.pathname.includes("instructor")
    ) {
        return <Navigate to="/instructor" />;
    }

    return <Fragment>{children}</Fragment>;
}

export default RouteGuard;
