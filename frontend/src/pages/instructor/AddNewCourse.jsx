import CourseLanding from "@/components/instructor-view/courses/CourseLanding";
import CourseCurriculum from "@/components/instructor-view/courses/Curriculum";
import CourseSettings from "@/components/instructor-view/courses/Settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    courseCurriculumInitialFormData,
    landingPageInitialFormData,
} from "@/config";
import { useAuthContext } from "@/context/auth/context";
import { useInstructorContext } from "@/context/instructor/context";
import axiosInstance from "@/lib/axios";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function AddNewCourse() {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const {
        landingPageFormData,
        setLandingPageFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        submitcourseLoading,
        setSubmitCourseLoading,
    } = useInstructorContext();
    const { user } = useAuthContext();

    function isEmpty(value) {
        if (Array.isArray(value)) return value.length === 0;
        return value === "" || value === null || value === undefined;
    }

    function validateFormData() {
        for (const key in landingPageFormData) {
            if (["students", "__v"].includes(key)) continue;

            if (isEmpty(landingPageFormData[key])) {
                return false;
            }
        }

        let hasFreePreview = false;

        for (const [_, item] of courseCurriculumFormData.entries()) {
            if (
                isEmpty(item.title) ||
                isEmpty(item.videoUrl) ||
                isEmpty(item.public_id)
            ) {
                return false;
            }

            if (item.freePreview) hasFreePreview = true;
        }

        if (!hasFreePreview) {
            return false;
        }

        return true;
    }

    async function handleSubmit() {
        const formData = {
            instructorId: user.user._id,
            instructorName: user.user.userName,
            date: new Date(),
            ...landingPageFormData,
            students: [],
            curriculum: courseCurriculumFormData,
            isPublished: true,
        };
        try {
            setSubmitCourseLoading(true);
            let res;
            if (courseId) {
                res = await axiosInstance.patch(
                    `/courses/${courseId}`,
                    formData,
                    {
                        withCredentials: true,
                    }
                );
            } else {
                res = await axiosInstance.post("/courses", formData, {
                    withCredentials: true,
                });
            }

            if (res.data.status === "success") {
                setLandingPageFormData(landingPageInitialFormData);
                setCourseCurriculumFormData(courseCurriculumInitialFormData);
                if (courseId) {
                    toast("Course updated successfully");
                } else {
                    toast("Course add successfully");
                }
                navigate(-1);
            }
        } catch (error) {
            toast(error.response?.data?.message);
        } finally {
            setSubmitCourseLoading(false);
        }
    }

    async function fetchCourseById() {
        try {
            const res = await axiosInstance.get(`/courses/${courseId}`, {
                withCredentials: true,
            });

            if (res.data.status === "success") {
                const course = res.data.data?.course;
                const courseData = Object.keys(res.data.data.course).reduce(
                    (acc, key) => {
                        acc[key] = course[key] || landingPageFormData[key];
                        return acc;
                    },
                    {}
                );
                setLandingPageFormData(courseData);
                setCourseCurriculumFormData(course?.curriculum);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // console.log(validateFormData());
    useEffect(() => {
        if (courseId) fetchCourseById();
    }, [courseId]);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold mb-5">
                    Create a new course
                </h1>
                <Button
                    onClick={handleSubmit}
                    disabled={!validateFormData()}
                    className="text-sm tracking-wider font-bold px-8"
                >
                    {submitcourseLoading ? (
                        <p>
                            <Loader className="animate-spin" />
                        </p>
                    ) : (
                        "SUBMIT"
                    )}
                </Button>
            </div>
            <Card>
                <CardContent>
                    <div className="container mx-auto p-4">
                        <Tabs defaultValue="curriculum" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="curriculum">
                                    Curriculum
                                </TabsTrigger>
                                <TabsTrigger value="course-landing-page">
                                    Course Landing Page
                                </TabsTrigger>
                                <TabsTrigger value="settings">
                                    Settings
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="curriculum">
                                <CourseCurriculum />
                            </TabsContent>
                            <TabsContent value="course-landing-page">
                                <CourseLanding />
                            </TabsContent>
                            <TabsContent value="settings">
                                <CourseSettings />
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
