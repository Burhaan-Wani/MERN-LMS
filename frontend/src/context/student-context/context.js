import { useContext, createContext } from "react";

export const StudentContext = createContext(null);

export const useStudentContext = () => {
    const data = useContext(StudentContext);
    if (data === "undefined") {
        console.log("Cannot use student context outside provider");
    }
    return data;
};
