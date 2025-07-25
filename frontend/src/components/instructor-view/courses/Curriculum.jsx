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
import React, { useRef } from "react";

export default function CourseCurriculum() {
    const {
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
    } = useInstructorContext();

    const bulkUploadInputRef = useRef(null);
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
                typeof item === "object" &&
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

    function bulkUploadClick() {
        bulkUploadInputRef.current?.click();
    }

    function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
        return arr.every(obj => {
            return Object.entries(obj).every(([, value]) => {
                if (typeof value === "boolean") {
                    return true;
                }
                return value === "";
            });
        });
    }

    async function handleBulkUpload(event) {
        const selectedFiles = Array.from(event.target.files);
        const bulkUploads = new FormData();

        selectedFiles.forEach(fileItem =>
            bulkUploads.append("files", fileItem)
        );

        try {
            setMediaUploadProgress(true);
            const res = await axiosInstance.post(
                "/media/bulk-upload",
                bulkUploads,
                {
                    withCredentials: true,
                }
            );

            if (res.data.status === "success") {
                const uploads = res.data.data.uploads;
                let cpyCourseCurriculumFormData =
                    areAllCourseCurriculumFormDataObjectsEmpty(
                        courseCurriculumFormData
                    )
                        ? []
                        : [...courseCurriculumFormData];

                cpyCourseCurriculumFormData = [
                    ...cpyCourseCurriculumFormData,
                    ...uploads.map((item, index) => ({
                        videoUrl: item.url,
                        public_id: item.public_id,
                        freePreview: false,
                        title: `Lecture ${
                            cpyCourseCurriculumFormData.length + (index + 1)
                        }`,
                    })),
                ];
                setCourseCurriculumFormData(cpyCourseCurriculumFormData);
                setMediaUploadProgress(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDeleteLecture(currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const videoId = cpyCourseCurriculumFormData[currentIndex].public_id;
        try {
            const res = await axiosInstance.delete(`/media/delete/${videoId}`, {
                withCredentials: true,
            });

            if (res.data.status === "success") {
                cpyCourseCurriculumFormData =
                    cpyCourseCurriculumFormData.filter(
                        (_, index) => index !== currentIndex
                    );
                setCourseCurriculumFormData(cpyCourseCurriculumFormData);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle>Create Course Curriculum</CardTitle>
                <div>
                    <Input
                        ref={bulkUploadInputRef}
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        id="bulk-media-upload"
                        onChange={handleBulkUpload}
                    />
                    <Button
                        as="label"
                        htmlFor="bulk-media-upload"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={bulkUploadClick}
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
                                            onProgressUpdate={() => {}}
                                        />
                                        <Button
                                            onClick={() =>
                                                handleReplaceMedia(index)
                                            }
                                        >
                                            Replace Video
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleDeleteLecture(index)
                                            }
                                            className="bg-red-900"
                                        >
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
