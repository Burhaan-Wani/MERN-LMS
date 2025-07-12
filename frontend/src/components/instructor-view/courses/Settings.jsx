import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInstructorContext } from "@/context/instructor/context";
import axiosInstance from "@/lib/axios";
import { Loader } from "lucide-react";
import React from "react";

export default function CourseSettings() {
    const {
        landingPageFormData,
        setLandingPageFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
    } = useInstructorContext();

    const handleImageUploadChange = async e => {
        const imageFile = e.target.files[0];
        if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);
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
                    setLandingPageFormData(curr => ({
                        ...curr,
                        image: res.data.data.result.url,
                    }));
                }
            } catch (error) {
                console.log(error);
            } finally {
                setMediaUploadProgress(false);
            }
        }
    };
    console.log(landingPageFormData);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <Label>Upload Course Image</Label>
                    {landingPageFormData?.image ? (
                        <img
                            src={landingPageFormData.image}
                            alt="landing-page-image"
                        />
                    ) : mediaUploadProgress ? (
                        <p className="flex justify-center">
                            <Loader className="animate-spin" />
                        </p>
                    ) : (
                        <Input
                            className={"cursor-pointer"}
                            onChange={handleImageUploadChange}
                            type="file"
                            accept="image/*"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
