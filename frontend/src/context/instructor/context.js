import { createContext, useContext } from "react";

// AUTH CONTEXT
export const InstructorContext = createContext(null);
export const useInstructorContext = () => {
    const data = useContext(InstructorContext);
    if (data === "undefined") {
        throw new Error("Cannot access auth data outside AuthContext");
    }
    return data;
};
