import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <span>Memuat sesi...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export const PublicRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
