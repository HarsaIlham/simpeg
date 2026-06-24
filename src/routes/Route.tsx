import type { RouteObject } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../components/pages/Home";
import Profil from "../components/pages/Profil";
import Akun from "../components/pages/Akun";
import Login from "../components/pages/Login/Login";
import DataDiklat from "../components/pages/DataDiklat";
import DataKeluarga from "../components/pages/DataKeluarga";
import RiwayatKarir from "../components/pages/RiwayatKarir";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";
import StrSip from "../components/pages/StrSip";
import DiklatPegawai from "../components/pages/DiklatPegawai";
import PesertaDiklat from "../components/pages/DiklatPegawai/PesertaDiklat";
import ValidasiDokumen from "../components/pages/ValidasiDokumen";
import VerifikasiKelayakan from "../components/pages/VerifikasiKelayakan";
import Pegawai from "../components/pages/Pegawai";
import DetailPegawai from "../components/pages/Pegawai/DetailPegawai";
import Pengaturan from "../components/pages/Pengaturan";

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