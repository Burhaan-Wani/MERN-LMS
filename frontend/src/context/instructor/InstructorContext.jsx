import { useState } from "react";
import { InstructorContext } from "./context";
import {
    courseCurriculumInitialFormData,
    landingPageInitialFormData,
} from "@/config";

const InstructorProvider = ({ children }) => {
    const [landingPageFormData, setLandingPageFormData] = useState(
        landingPageInitialFormData
    );

    const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
        courseCurriculumInitialFormData
    );

    const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
    const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
        useState(0);

    const [submitcourseLoading, setSubmitCourseLoading] = useState(false);

    const [instructorCoursesList, setInstructorCoursesList] = useState([]);
    return (
        <InstructorContext.Provider
            value={{
                landingPageFormData,
                setLandingPageFormData,
                courseCurriculumFormData,
                setCourseCurriculumFormData,
                mediaUploadProgress,
                setMediaUploadProgress,
                mediaUploadProgressPercentage,
                setMediaUploadProgressPercentage,
                submitcourseLoading,
                setSubmitCourseLoading,
                instructorCoursesList,
                setInstructorCoursesList,
            }}
        >
            {children}
        </InstructorContext.Provider>
    );
};

export default InstructorProvider;
