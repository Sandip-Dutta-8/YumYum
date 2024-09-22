import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import AuthCallbackPage from "./pages/AuthCallbackPage"
import Layout from "./layouts/Layout";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>}/>
            <Route path="/auth-callback" element={<AuthCallbackPage />} />
            <Route path="/user-profile" element={<UserProfilePage />}/>
            <Route path="*" element={<Navigate to="/" />}/>
        </Routes>  
    );
};

export default AppRoutes;