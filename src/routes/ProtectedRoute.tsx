import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PageLoader from "../components/ui/atoms/PageLoader";

export const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <PageLoader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return (
        <Suspense fallback={<PageLoader />}>
            <Outlet />
        </Suspense>
    );
};

export const PublicRoute = () => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return null;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <Suspense fallback={<PageLoader />}>
            <Outlet />
        </Suspense>
    );
};
