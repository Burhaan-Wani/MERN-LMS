import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthContext } from "@/context/auth/context";
import { useStudentContext } from "@/context/student-context/context";
import axiosInstance from "@/lib/axios";
import { Loader, Watch } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
    const { myPaidCourses, setMyPaidCourses, loading, setLoading } =
        useStudentContext();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const userId = user.user._id;
    useEffect(() => {
        async function fetchPaidCourses() {
            try {
                setLoading(true);
                const res = await axiosInstance.get(
                    `/students/my-courses/${userId}`,
                    {
                        withCredentials: true,
                    }
                );
                setMyPaidCourses(res.data.data.courses);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPaidCourses();
    }, [userId]);

    if (loading)
        return (
            <div className="h-[100vh] flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-8">My Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {myPaidCourses && myPaidCourses.length > 0 ? (
                    myPaidCourses.map(course => (
                        <Card key={course.title} className="flex flex-col">
                            <CardContent className="p-4 flex-grow">
                                <img
                                    src={course?.courseImage}
                                    alt={course?.title}
                                    className="h-52 w-full object-cover rounded-md mb-4"
                                />
                                <h3 className="font-bold mb-1">
                                    {course?.title}
                                </h3>
                                <p className="text-sm text-gray-700 mb-2">
                                    {course?.instructorName}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={() =>
                                        navigate(
                                            `/course-progress/${course?.courseId}`
                                        )
                                    }
                                    className="flex-1"
                                >
                                    <Watch className="mr-2 h-4 w-4" />
                                    Start Watching
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <h1 className="text-3xl font-bold">No Courses found</h1>
                )}
            </div>
        </div>
    );
}
