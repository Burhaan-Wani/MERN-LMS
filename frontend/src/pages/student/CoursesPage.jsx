// ✅ Refactored CoursePage component
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { useStudentContext } from "@/context/student-context/context";
import axiosInstance from "@/lib/axios";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function CoursesPage() {
    // const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { studentCourseList, setStudentCourseList, loading, setLoading } =
        useStudentContext();

    const getInitialFilters = () => {
        const initial = {};
        for (const key of Object.keys(filterOptions)) {
            const param = searchParams.get(key);
            if (param) initial[key] = param.split(",");
        }
        return initial;
    };

    const [filters, setFilters] = useState(getInitialFilters);
    const sort = searchParams.get("sortBy") || "price-lowtohigh";

    function handleFilterOnChange(sectionId, option) {
        const prev = filters[sectionId] || [];
        const updated = prev.includes(option.id)
            ? prev.filter(id => id !== option.id)
            : [...prev, option.id];

        const newFilters = {
            ...filters,
            [sectionId]: updated,
        };

        if (updated.length === 0) delete newFilters[sectionId];
        setFilters(newFilters);
    }

    function updateSearchParams(newFilters, newSort = sort) {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, val]) => {
            if (val.length > 0) params.set(key, val.join(","));
        });
        params.set("sortBy", newSort);
        setSearchParams(params);
    }

    async function fetchAllCourses(filterState, sortValue) {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filterState).forEach(([key, val]) => {
                if (val.length > 0) params.set(key, val.join(","));
            });
            params.set("sortBy", sortValue);

            const res = await axiosInstance.get(
                `/students?${params.toString()}`,
                { withCredentials: true }
            );
            if (res.data.status === "success") {
                setStudentCourseList(res.data.data.courses);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        updateSearchParams(filters, sort);
        fetchAllCourses(filters, sort);
        sessionStorage.setItem("filters", JSON.stringify(filters));
    }, [filters, sort]);

    useEffect(() => {
        const stored = sessionStorage.getItem("filters");
        if (stored) setFilters(JSON.parse(stored));

        return () => sessionStorage.removeItem("filters");
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All Courses</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <aside className="w-full md:w-64 space-y-4">
                    <div>
                        {Object.keys(filterOptions).map(keyItem => (
                            <div className="p-4 border-b" key={keyItem}>
                                <h3 className="font-bold mb-3">
                                    {keyItem.toUpperCase()}
                                </h3>
                                <div className="grid gap-2 mt-2">
                                    {filterOptions[keyItem].map(option => (
                                        <Label
                                            key={option.id}
                                            className="flex font-medium items-center gap-3"
                                        >
                                            <Checkbox
                                                checked={
                                                    filters[keyItem]?.includes(
                                                        option.id
                                                    ) || false
                                                }
                                                onCheckedChange={() =>
                                                    handleFilterOnChange(
                                                        keyItem,
                                                        option
                                                    )
                                                }
                                            />
                                            {option.label}
                                        </Label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
                <main className="flex-1">
                    <div className="flex justify-end items-center mb-4 gap-5">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 p-5"
                                >
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    <span className="text-[16px] font-medium">
                                        Sort By
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-[180px]"
                            >
                                <DropdownMenuRadioGroup
                                    value={sort}
                                    onValueChange={value =>
                                        updateSearchParams(filters, value)
                                    }
                                >
                                    {sortOptions.map(sortItem => (
                                        <DropdownMenuRadioItem
                                            value={sortItem.id}
                                            key={sortItem.id}
                                        >
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-sm text-black font-bold">
                            {studentCourseList.length} Results
                        </span>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <Skeleton />
                        ) : studentCourseList.length > 0 ? (
                            studentCourseList.map(course => (
                                <Card
                                    key={course?._id}
                                    className="cursor-pointer"
                                >
                                    <CardContent className="flex gap-4 p-4">
                                        <div className="w-48 h-32 flex-shrink-0">
                                            <img
                                                src={course?.image}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2">
                                                {course?.title}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Created By{" "}
                                                <span className="font-bold">
                                                    {course?.instructorName}
                                                </span>
                                            </p>
                                            <p className="text-[16px] text-gray-600 mt-3 mb-2">
                                                {`${
                                                    course?.curriculum?.length
                                                } ${
                                                    course?.curriculum
                                                        ?.length === 1
                                                        ? "Lecture"
                                                        : "Lectures"
                                                } - ${course?.level.toUpperCase()} Level`}
                                            </p>
                                            <p className="font-bold text-lg">
                                                ${course?.pricing}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <h1 className="font-extrabold text-4xl">
                                No Courses Found
                            </h1>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
