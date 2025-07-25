import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    courseCurriculumInitialFormData,
    landingPageInitialFormData,
} from "@/config";
import { useInstructorContext } from "@/context/instructor/context";
import { Delete, Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function InstructorCourses({ listOfCourses }) {
    const navigate = useNavigate();
    const { setLandingPageFormData, setCourseCurriculumFormData } =
        useInstructorContext();

    function handleCreateNewCourse() {
        setLandingPageFormData(landingPageInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate("/instructor/create-new-course");
    }
    return (
        <Card>
            <CardHeader className="flex justify-between flex-row items-center">
                <CardTitle className="text-3xl font-extrabold">
                    All Courses
                </CardTitle>
                <Button onClick={handleCreateNewCourse} className="p-6">
                    Create New Course
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listOfCourses && listOfCourses.length > 0
                                ? listOfCourses.map(course => (
                                      <TableRow key={course.title}>
                                          <TableCell className="font-medium">
                                              {course.title}
                                          </TableCell>
                                          <TableCell>
                                              {course.students.length}
                                          </TableCell>
                                          <TableCell>
                                              {`$${
                                                  course.pricing *
                                                  course.students.length
                                              }`}
                                          </TableCell>
                                          <TableCell className="text-right">
                                              <Button
                                                  onClick={() => {
                                                      navigate(
                                                          `edit-course/${course._id}`
                                                      );
                                                  }}
                                                  variant="ghost"
                                                  size="sm"
                                              >
                                                  <Edit className="h-6 w-6" />
                                              </Button>
                                              <Button variant="ghost" size="sm">
                                                  <Delete className="h-6 w-6" />
                                              </Button>
                                          </TableCell>
                                      </TableRow>
                                  ))
                                : null}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
