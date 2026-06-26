import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";

const Home = lazy(() => import("../components/pages/Home"));
const Profil = lazy(() => import("../components/pages/Profil"));
const Akun = lazy(() => import("../components/pages/Akun"));
const Login = lazy(() => import("../components/pages/Login/Login"));
const DataDiklat = lazy(() => import("../components/pages/DataDiklat"));
const DataKeluarga = lazy(() => import("../components/pages/DataKeluarga"));
const RiwayatKarir = lazy(() => import("../components/pages/RiwayatKarir"));
const StrSip = lazy(() => import("../components/pages/StrSip"));
const DiklatPegawai = lazy(() => import("../components/pages/DiklatPegawai"));
const PesertaDiklat = lazy(() => import("../components/pages/DiklatPegawai/PesertaDiklat"));
const ValidasiDokumen = lazy(() => import("../components/pages/ValidasiDokumen"));
const VerifikasiKelayakan = lazy(() => import("../components/pages/VerifikasiKelayakan"));
const Pegawai = lazy(() => import("../components/pages/Pegawai"));
const DetailPegawai = lazy(() => import("../components/pages/Pegawai/DetailPegawai"));
const Pengaturan = lazy(() => import("../components/pages/Pengaturan"));

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
                        path: "akun",
                        element: <Akun />,
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
                    {
                        path: "perizinan",
                        element: <StrSip />,
                    },
                    {
                        path: "diklat-pegawai",
                        element: <DiklatPegawai />,
                    },
                    {
                        path: "diklat-pegawai/:id/peserta",
                        element: <PesertaDiklat />,
                    },
                    {
                        path: "validasi-dokumen",
                        element: <ValidasiDokumen />,
                    },
                    {
                        path: "verifikasi-kelayakan",
                        element: <VerifikasiKelayakan />,
                    },
                    {
                        path: "pegawai",
                        element: <Pegawai />,
                    },
                    {
                        path: "pegawai/:id",
                        element: <DetailPegawai />,
                    },
                    {
                        path: "pengaturan",
                        element: <Pengaturan />,
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
            },
            // {
            //     path: "/str-sip",
            //     element: <StrSip />,
            // },
            // {
            //     path: "/dashboard-hrd",
            //     element: <DashboardHrd />,
            // },
            // {
            //     path: "/",
            //     element: <DashboardLayout />,
            //     children: [
            //         {
            //             index: true,
            //             element: <Home />,
            //         },
            //         {
            //             path: "profil",
            //             element: <Profil />,
            //         },
            //         {
            //             path: "data-diklat",
            //             element: <DataDiklat />,
            //         },
            //         {
            //             path: "data-keluarga",
            //             element: <DataKeluarga />,
            //         },
            //         {
            //             path: "riwayat-karir",
            //             element: <RiwayatKarir />,
            //         },
            //     ],
            // }
        ]
    },
];

export default routes;