import StudentViewCommonHeader from "@/components/students-view/Header";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function StudentLayout() {
    const { pathname } = useLocation();
    return (
        <div>
            {!pathname.includes("course-progress") && (
                <StudentViewCommonHeader />
            )}
            <Outlet />
        </div>
    );
}
