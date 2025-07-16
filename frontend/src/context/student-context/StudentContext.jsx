import { useState } from "react";
import { StudentContext } from "./context";

const StudentProvider = ({ children }) => {
    const [studentCourseList, setStudentCourseList] = useState([]);
    return (
        <StudentContext.Provider
            value={{
                studentCourseList,
                setStudentCourseList,
            }}
        >
            {children}
        </StudentContext.Provider>
    );
};

export default StudentProvider;
