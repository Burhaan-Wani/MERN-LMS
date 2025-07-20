import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import VideoPlayer from "@/components/video-player";
import { useStudentContext } from "@/context/student-context/context";
import { CheckCircle, Globe, Loader, Lock, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export default function CourseDetails() {
    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
        useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const { courseDetails, loading, fetchCourseDetails, hasPurchasedCourse } =
        useStudentContext();

    const getIndexOfFreePreviewUrl = courseDetails?.curriculum.findIndex(
        curr => curr.freePreview
    );

    const handleSetFreePreview = curriculum => {
        setShowDialog(true);
        setDisplayCurrentVideoFreePreview(curriculum.videoUrl);
    };

    useEffect(() => {
        fetchCourseDetails(id);
    }, [id]);

    if (loading)
        return (
            <div className="h-[100vh] flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );

    if (hasPurchasedCourse !== "") {
        return (
            <Navigate to={`/course-progress/${courseDetails._id}`} replace />
        );
    }
    return (
        <div className=" mx-auto p-4">
            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <h1 className="text-3xl font-bold mb-4">
                    {courseDetails?.title}
                </h1>
                <p className="text-xl mb-4">{courseDetails?.subtitle}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>
                        <span className="font-semibold mr-1">Created By:</span>
                        {courseDetails?.instructorName}
                    </span>
                    <span>
                        <span className="font-semibold mr-1">Created On:</span>
                        {courseDetails?.date.split("T")[0]}
                    </span>
                    <span className="flex items-center">
                        <Globe className="mr-1 h-4 w-4" />
                        {courseDetails?.primaryLanguage}
                    </span>
                    <span>
                        {courseDetails?.students.length}{" "}
                        {courseDetails?.students.length <= 1
                            ? "Student"
                            : "Students"}
                    </span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>What you'll learn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {courseDetails?.objectives
                                    .split(",")
                                    .map((objective, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                                            <span>{objective}</span>
                                        </li>
                                    ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Description</CardTitle>
                        </CardHeader>
                        <CardContent>{courseDetails?.description}</CardContent>
                    </Card>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Curriculum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {courseDetails?.curriculum?.map(
                                (curriculumItem, index) => (
                                    <li
                                        key={index}
                                        className={`${
                                            curriculumItem?.freePreview
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed"
                                        } flex items-center mb-4`}
                                        onClick={
                                            curriculumItem?.freePreview
                                                ? () =>
                                                      handleSetFreePreview(
                                                          curriculumItem
                                                      )
                                                : null
                                        }
                                    >
                                        {curriculumItem?.freePreview ? (
                                            <PlayCircle className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Lock className="mr-2 h-4 w-4" />
                                        )}
                                        <span>{curriculumItem?.title}</span>
                                    </li>
                                )
                            )}
                        </CardContent>
                    </Card>
                </main>
                <aside className="w-full md:w-[500px]">
                    <Card className="sticky top-4">
                        <CardContent className="">
                            <p className="font-bold text-2xl">Free preview</p>
                            <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                                <VideoPlayer
                                    url={
                                        getIndexOfFreePreviewUrl !== -1
                                            ? courseDetails?.curriculum[
                                                  getIndexOfFreePreviewUrl
                                              ].videoUrl
                                            : ""
                                    }
                                    width="450px"
                                    height="200px"
                                />
                            </div>
                            <div className="mb-4">
                                <span className="text-3xl font-bold">
                                    ${courseDetails?.pricing}
                                </span>
                            </div>
                            <Button
                                onClick={() =>
                                    navigate(
                                        `/courses/checkout/${courseDetails._id}`
                                    )
                                }
                                className="w-full"
                            >
                                Buy Now
                            </Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
            <Dialog
                open={showDialog}
                onOpenChange={() => {
                    setShowDialog(false);
                    setDisplayCurrentVideoFreePreview(null);
                }}
            >
                <DialogContent className="w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Course Preview</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-lg flex items-center justify-center">
                        <VideoPlayer
                            url={displayCurrentVideoFreePreview}
                            width="450px"
                            height="200px"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        {courseDetails?.curriculum
                            ?.filter(item => item.freePreview)
                            .map((filteredItem, index) => (
                                <p
                                    className={`${
                                        displayCurrentVideoFreePreview ===
                                        filteredItem.videoUrl
                                            ? "bg-gray-100"
                                            : ""
                                    } cursor-pointer p-1 rounded text-[16px] font-medium`}
                                    key={filteredItem.title}
                                    onClick={() =>
                                        handleSetFreePreview(filteredItem)
                                    }
                                >
                                    {`${index + 1}. `}
                                    {filteredItem?.title}
                                </p>
                            ))}
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
