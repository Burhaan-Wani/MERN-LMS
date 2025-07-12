import { createContext, useContext } from "react";

// AUTH CONTEXT
export const AuthContext = createContext(null);
export const useAuthContext = () => {
    const data = useContext(AuthContext);
    if (data === "undefined") {
        throw new Error("Cannot access auth data outside AuthContext");
    }
    return data;
};
