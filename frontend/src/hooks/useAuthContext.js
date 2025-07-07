import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
    const data = useContext(AuthContext);
    if (data === "undefined") {
        throw new Error("Cannot access auth data outside AuthContext");
    }
    return data;
};
