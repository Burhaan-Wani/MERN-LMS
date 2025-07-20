import { useState } from "react";
import { StudentContext } from "./context";
import axiosInstance from "@/lib/axios";

const StudentProvider = ({ children }) => {
    const [studentCourseList, setStudentCourseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [courseDetails, setCourseDetails] = useState(null);
    const [myPaidCourses, setMyPaidCourses] = useState([]);
    const [hasPurchasedCourse, setHasPurchasedCourse] = useState("");

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

    async function fetchCourseDetails(id) {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/students/${id}`, {
                withCredentials: true,
            });

            if (res.data.status === "success") {
                setCourseDetails(res.data.data.course);
                setHasPurchasedCourse(res.data.data.isPurchased);
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
                fetchCourseDetails,
                myPaidCourses,
                setMyPaidCourses,
                hasPurchasedCourse,
                setHasPurchasedCourse,
            }}
        >
            {children}
        </StudentContext.Provider>
    );
};

export default StudentProvider;
