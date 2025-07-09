import { Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import RouteGuard from "./components/route-guard";
import StudentHomePage from "./pages/student/Home";
import StudentLayout from "./layout/student-view";
import InstructorDashboardPage from "./pages/instructor";
import { useAuthContext } from "./context/context";

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
                    path="/"
                    element={
                        <RouteGuard user={user} loading={isLoading}>
                            <StudentLayout />
                        </RouteGuard>
                    }
                >
                    <Route path="" element={<StudentHomePage />} />
                    <Route path="home" element={<StudentHomePage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
