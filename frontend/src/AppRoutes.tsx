import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import AuthCallbackPage from "./pages/AuthCallbackPage"
import Layout from "./layouts/Layout";
import ProtectedRoute from "./auth/ProtectedRoute";
import ManageRestaurantPage from "./pages/ManageRestaurantPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<Layout showHero>
                    <HomePage />
                </Layout>
                }
            />
            <Route path="/auth-callback" element={<AuthCallbackPage />} />
            <Route element={<ProtectedRoute />}>
                <Route
                    path="/user-profile"
                    element={
                        <Layout>
                            <UserProfilePage />
                        </Layout>
                    }
                />
                <Route
                    path="/manage-restaurant"
                    element={
                        <Layout>
                            <ManageRestaurantPage />
                        </Layout>
                    }
                />
            </Route>
                <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;