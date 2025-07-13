import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { useInstructorContext } from "@/context/instructor/context";
import axiosInstance from "@/lib/axios";
import { Loader, Upload } from "lucide-react";
import React from "react";

export default function CourseCurriculum() {
    const {
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
    } = useInstructorContext();

    function handleNewLecture() {
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            {
                ...courseCurriculumInitialFormData[0],
            },
        ]);
    }

    function handleCourseTitleChange(event, currentIndex) {
        const cpycourseCurriculumFormData = [...courseCurriculumFormData];
        cpycourseCurriculumFormData[currentIndex] = {
            ...cpycourseCurriculumFormData[currentIndex],
            title: event.target.value,
        };
        setCourseCurriculumFormData(cpycourseCurriculumFormData);
    }
    function handleFreePreviewChange(currentValue, currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            freePreview: currentValue,
        };

        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    async function handleSingleLectureUpload(event, currentIndex) {
        const videoFile = event.target.files[0];
        if (videoFile) {
            const formData = new FormData();
            formData.append("file", videoFile);
            try {
                setMediaUploadProgress(true);
                const res = await axiosInstance.post(
                    "/media/upload",
                    formData,
                    {
                        withCredentials: true,
                    }
                );
                if (res.data.status === "success") {
                    const cpycourseCurriculumFormData = [
                        ...courseCurriculumFormData,
                    ];
                    cpycourseCurriculumFormData[currentIndex] = {
                        ...cpycourseCurriculumFormData[currentIndex],
                        videoUrl: res.data.data.result.url,
                        public_id: res.data.data.result.public_id,
                    };
                    setCourseCurriculumFormData(cpycourseCurriculumFormData);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setMediaUploadProgress(false);
            }
        }
    }

    function isCourseCurriculumFormDataValid() {
        return courseCurriculumFormData.every(item => {
            return (
                item &&
                item === "object" &&
                item.title.trim() !== "" &&
                item.videoUrl.trim() !== ""
            );
        });
    }

    async function handleReplaceMedia(currentIndex) {
        console.log(currentIndex);
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const getCurrentVideoPublicId =
            cpyCourseCurriculumFormData[currentIndex].public_id;
        try {
            setMediaUploadProgress(true);
            const res = await axiosInstance.delete(
                `/media/delete/${getCurrentVideoPublicId}`,
                {
                    withCredentials: true,
                }
            );
            if (res.data.status === "success") {
                cpyCourseCurriculumFormData[currentIndex] = {
                    ...cpyCourseCurriculumFormData[currentIndex],
                    videoUrl: "",
                    public_id: "",
                };

                setCourseCurriculumFormData(cpyCourseCurriculumFormData);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setMediaUploadProgress(false);
        }
    }
    console.log(courseCurriculumFormData);
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle>Create Course Curriculum</CardTitle>
                <div>
                    <Input
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        id="bulk-media-upload"
                    />
                    <Button
                        as="label"
                        htmlFor="bulk-media-upload"
                        variant="outline"
                        className="cursor-pointer"
                    >
                        <Upload className="w-4 h-5 mr-2" />
                        Bulk Upload
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={handleNewLecture}
                    disabled={
                        !isCourseCurriculumFormDataValid() ||
                        mediaUploadProgress
                    }
                >
                    Add Lecture
                </Button>
                <div className="mt-4 space-y-4">
                    {courseCurriculumFormData.map((curriculumItem, index) => (
                        <div key={index} className="border p-5 rounded-md">
                            <div className="flex gap-5 items-center">
                                <h3 className="font-semibold">
                                    Lecture {index + 1}
                                </h3>
                                <Input
                                    name={`title-${index + 1}`}
                                    placeholder="Enter lecture title"
                                    className="max-w-96"
                                    onChange={event =>
                                        handleCourseTitleChange(event, index)
                                    }
                                    value={
                                        courseCurriculumFormData[index]?.title
                                    }
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        onCheckedChange={value =>
                                            handleFreePreviewChange(
                                                value,
                                                index
                                            )
                                        }
                                        checked={
                                            courseCurriculumFormData[index]
                                                ?.freePreview
                                        }
                                        id={`freePreview-${index + 1}`}
                                    />
                                    <Label htmlFor={`freePreview-${index + 1}`}>
                                        Free Preview
                                    </Label>
                                </div>
                            </div>
                            <div className="mt-6">
                                {courseCurriculumFormData[index]?.videoUrl ? (
                                    <div className="flex gap-3">
                                        <VideoPlayer
                                            width="400px"
                                            height="220px"
                                            url={
                                                courseCurriculumFormData[index]
                                                    ?.videoUrl
                                            }
                                        />
                                        <Button
                                            disabled={mediaUploadProgress}
                                            onClick={() =>
                                                handleReplaceMedia(index)
                                            }
                                        >
                                            {mediaUploadProgress ? (
                                                <Loader className="animate-spin" />
                                            ) : (
                                                "Replace Video"
                                            )}
                                        </Button>
                                        <Button className="bg-red-900">
                                            Delete Lecture
                                        </Button>
                                    </div>
                                ) : mediaUploadProgress ? (
                                    <p className="flex justify-center">
                                        <Loader className="animate-spin" />
                                    </p>
                                ) : (
                                    <Input
                                        type="file"
                                        accept="video/*"
                                        className="mb-4"
                                        onChange={e =>
                                            handleSingleLectureUpload(e, index)
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
