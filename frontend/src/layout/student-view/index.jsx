import StudentViewCommonHeader from "@/components/students-view/Header";
import React from "react";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
    return (
        <div>
            <StudentViewCommonHeader />
            <Outlet />
        </div>
    );
}
