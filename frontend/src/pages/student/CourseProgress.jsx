import { useStudentContext } from "@/context/student-context/context";
import React, { useEffect } from "react";

export default function CourseProgress() {
    const { setHasPurchasedCourse, setCourseDetails } = useStudentContext();
    useEffect(() => {
        return () => {
            setCourseDetails(null);
            setHasPurchasedCourse("");
        };
    }, []);
    return <div>CourseProgress</div>;
}
