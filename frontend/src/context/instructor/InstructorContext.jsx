import { useState } from "react";
import { InstructorContext } from "./context";
import { courseCurriculumInitialFormData } from "@/config";

const InstructorProvider = ({ children }) => {
    const [landingPageFormData, setLandingPageFormData] = useState({
        title: "",
        category: "",
        level: "",
        primaryLanguage: "",
        subtitle: "",
        description: "",
        pricing: "",
        objectives: "",
        welcomeMessage: "",
        image: "",
    });

    const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
        courseCurriculumInitialFormData
    );

    const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
    const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
        useState(0);

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
            }}
        >
            {children}
        </InstructorContext.Provider>
    );
};

export default InstructorProvider;
