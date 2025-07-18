import { useState } from "react";
import { StudentContext } from "./context";
import axiosInstance from "@/lib/axios";

const StudentProvider = ({ children }) => {
    const [studentCourseList, setStudentCourseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [courseDetails, setCourseDetails] = useState(null);

    async function fetchStudentViewCourses() {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/students`, {
                withCredentials: true,
            });

            if (res.data.status === "success") {
                setStudentCourseList(res.data.data.courses);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <StudentContext.Provider
            value={{
                loading,
                setLoading,
                studentCourseList,
                setStudentCourseList,
                fetchStudentViewCourses,
                courseDetails,
                setCourseDetails,
            }}
        >
            {children}
        </StudentContext.Provider>
    );
};

export default StudentProvider;
