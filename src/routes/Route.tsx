import type { RouteObject } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../components/pages/Home";
import Profil from "../components/pages/Profil";
import Login from "../components/pages/Login/Login";
import DataDiklat from "../components/pages/DataDiklat";
import DataKeluarga from "../components/pages/DataKeluarga";
import RiwayatKarir from "../components/pages/RiwayatKarir";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";

const routes: RouteObject[] = [
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: "profil",
                        element: <Profil />,
                    },
                    {
                        path: "data-diklat",
                        element: <DataDiklat />,
                    },
                    {
                        path: "data-keluarga",
                        element: <DataKeluarga />,
                    },
                    {
                        path: "riwayat-karir",
                        element: <RiwayatKarir />,
                    },
                ],
            }
        ]
    },
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <Login />,
            }
        ]
    },
];

export default routes;