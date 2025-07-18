import { Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import RouteGuard from "./components/route-guard";
import StudentHomePage from "./pages/student/Home";
import StudentLayout from "./layout/student-view";
import InstructorDashboardPage from "./pages/instructor";

import AddNewCourse from "./pages/instructor/addNewCourse";
import { useAuthContext } from "./context/auth/context";
import CoursesPage from "./pages/student/CoursesPage";
import CourseDetails from "./pages/student/courseDetails";

function App() {
    const { user, isLoading } = useAuthContext();
    return (
        <>
            <Routes>
                <Route
                    path="auth"
                    element={
                        <RouteGuard user={user} loading={isLoading}>
                            <Auth />
                        </RouteGuard>
                    }
                />
                <Route
                    path="/instructor"
                    element={
                        <RouteGuard user={user} loading={isLoading}>
                            <InstructorDashboardPage />
                        </RouteGuard>
                    }
                />
                <Route
                    path="/instructor/create-new-course"
                    element={
                        <RouteGuard user={user} loading={isLoading}>
                            <AddNewCourse />
                        </RouteGuard>
                    }
                />
                <Route
                    path="/instructor/edit-course/:courseId"
                    element={
                        <RouteGuard user={user} loading={isLoading}>
                            <AddNewCourse />
                        </RouteGuard>
                    }
                />
                <Route
                    path="/"
                    element={
                        <RouteGuard user={user} loading={isLoading}>
                            <StudentLayout />
                        </RouteGuard>
                    }
                >
                    <Route path="" element={<StudentHomePage />} />
                    <Route path="home" element={<StudentHomePage />} />
                    <Route path="courses" element={<CoursesPage />} />
                    <Route
                        path="courses/details/:id"
                        element={<CourseDetails />}
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
