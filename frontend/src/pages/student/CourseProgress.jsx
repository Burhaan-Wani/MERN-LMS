import { useStudentContext } from "@/context/student-context/context";
import axiosInstance from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import VideoPlayer from "@/components/video-player";
import { Label } from "@/components/ui/label";

export default function CourseProgress() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [lockCourse, setLockCourse] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCompletedDialog, setShowCompletedDialog] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const {
        setHasPurchasedCourse,
        fetchCourseDetails,
        courseDetails,
        currentCourseProgress,
        setCurrentCourseProgress,
    } = useStudentContext();

    async function fetchCurrentCourseProgress() {
        try {
            const res = await axiosInstance.get(`/progress/${courseId}`, {
                withCredentials: true,
            });
            if (!res.data.status === "fail") {
                setLockCourse(true);
            } else {
                setCurrentCourseProgress({
                    CourseDetails: res.data.data.courseDetails,
                    progress: res.data.data.progress,
                });
            }

            if (res.data.data.completed) {
                setCurrentLecture(res.data.data.courseDetails.curriculum[0]);
                setShowCompletedDialog(true);
                setShowConfetti(true);
                return;
            }

            if (res.data.data.progress.length === 0) {
                setCurrentLecture(res.data.data.courseDetails.curriculum[0]);
            } else {
                // get the last viewed lecture
                const lastIndexOfViewedAsTrue =
                    res?.data.data?.progress.reduceRight((acc, obj, index) => {
                        return acc === -1 && obj.viewed ? index : acc;
                    }, -1);
                setCurrentLecture(
                    res.data.data.courseDetails.curriculum[
                        lastIndexOfViewedAsTrue + 1
                    ]
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function updateCourseProgress() {
        try {
            const res = await axiosInstance.post(
                "/progress/mark-lecture-viewed",
                {
                    courseId: courseDetails?._id,
                    lectureId: currentLecture._id,
                },
                {
                    withCredentials: true,
                }
            );

            if (res.data.status === "success") {
                fetchCurrentCourseProgress();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleRewatchCourse() {
        try {
            const res = await axiosInstance.post(
                "/progress/reset-progress",
                {
                    courseId: courseDetails._id,
                },
                {
                    withCredentials: true,
                }
            );

            if (res.data.status === "success") {
                setCurrentLecture(null);
                setShowConfetti(false);
                setShowCompletedDialog(false);
                fetchCurrentCourseProgress();
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCourseDetails(courseId);
        return () => {
            setHasPurchasedCourse("");
        };
    }, []);

    useEffect(() => {
        fetchCurrentCourseProgress();
    }, [courseId]);

    useEffect(() => {
        if (currentLecture?.progressValue === 100) {
            updateCourseProgress();
        }
    }, [currentLecture]);

    useEffect(() => {
        if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
    }, [showConfetti]);

    return (
        <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
            {showConfetti && <Confetti />}
            <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={() => navigate("/my-courses")}
                        className=""
                        variant="ghost"
                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to My Courses Page
                    </Button>
                    <h1 className="text-lg font-bold hidden md:block">
                        {currentCourseProgress?.courseDetails?.title}
                    </h1>
                </div>
                <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                    {isSideBarOpen ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </Button>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div
                    className={`flex-1 ${
                        isSideBarOpen ? "mr-[400px]" : ""
                    } transition-all duration-300`}
                >
                    <VideoPlayer
                        width="100%"
                        height="500px"
                        url={currentLecture?.videoUrl}
                        onProgressUpdate={setCurrentLecture}
                        progressData={currentLecture}
                    />
                    <div className="p-6 bg-[#1c1d1f]">
                        <h2 className="text-2xl font-bold mb-2">
                            {currentLecture?.title}
                        </h2>
                    </div>
                </div>
                <div
                    className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
                        isSideBarOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <Tabs
                        defaultValue="content"
                        className="h-full flex flex-col"
                    >
                        <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-12 mt-1">
                            <TabsTrigger
                                value="content"
                                className=" text-gray-500 rounded-none h-full"
                            >
                                Course Content
                            </TabsTrigger>
                            <TabsTrigger
                                value="overview"
                                className={`text-gray-500 rounded-none h-full`}
                            >
                                Overview
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="content">
                            <ScrollArea className="h-full">
                                <div className="p-4 space-y-4">
                                    {courseDetails?.curriculum.map(item => (
                                        <div
                                            className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                                            key={item._id}
                                        >
                                            {currentCourseProgress?.progress?.find(
                                                progressItem =>
                                                    progressItem.lectureId ===
                                                    item._id
                                            )?.viewed ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Play className="h-4 w-4 " />
                                            )}
                                            {/* {console.log(item.title)} */}
                                            <span>{item?.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent
                            value="overview"
                            className="flex-1 overflow-hidden"
                        >
                            <ScrollArea className="h-full">
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-4">
                                        About this course
                                    </h2>
                                    <p className="text-gray-400">
                                        {
                                            currentCourseProgress?.courseDetails
                                                ?.description
                                        }
                                    </p>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Dialog open={lockCourse}>
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>You can't view this page</DialogTitle>
                        <DialogDescription>
                            Please purchase this course to get access
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={showCompletedDialog}>
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Congratulations!</DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You have completed the course</Label>
                            <div className="flex flex-row gap-3">
                                <Button onClick={() => navigate("/my-courses")}>
                                    My Courses Page
                                </Button>
                                <Button onClick={handleRewatchCourse}>
                                    Rewatch Course
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
