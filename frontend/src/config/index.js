export const courseCurriculumInitialFormData = [
    {
        title: "",
        videoUrl: "",
        freePreview: false,
        public_id: "", // id returned by cloudinary. Can be used to delete video from cloudinary
    },
];

export const landingPageInitialFormData = {
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
};

export const languageOptions = [
    { id: "english", label: "English" },
    { id: "spanish", label: "Spanish" },
    { id: "french", label: "French" },
    { id: "german", label: "German" },
    { id: "chinese", label: "Chinese" },
    { id: "japanese", label: "Japanese" },
    { id: "korean", label: "Korean" },
    { id: "portuguese", label: "Portuguese" },
    { id: "arabic", label: "Arabic" },
    { id: "russian", label: "Russian" },
];

export const courseLevelOptions = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
];

export const courseCategories = [
    { id: "web-development", label: "Web Development" },
    { id: "backend-development", label: "Backend Development" },
    { id: "data-science", label: "Data Science" },
    { id: "machine-learning", label: "Machine Learning" },
    { id: "artificial-intelligence", label: "Artificial Intelligence" },
    { id: "cloud-computing", label: "Cloud Computing" },
    { id: "cyber-security", label: "Cyber Security" },
    { id: "mobile-development", label: "Mobile Development" },
    { id: "game-development", label: "Game Development" },
    { id: "software-engineering", label: "Software Engineering" },
];
