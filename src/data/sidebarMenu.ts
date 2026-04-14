import {
  LayoutDashboard,
  UserRound,
  BookOpen,
  Users,
  BriefcaseBusiness,
} from "lucide-react";
import type { SidebarMenuItem } from "../types/sidebar";

export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    allowedRoles: ["pegawai", "admin", "hrd"],
  },
  {
    id: "profil",
    label: "Profil",
    icon: UserRound,
    path: "/profil",
    allowedRoles: ["pegawai", "admin", "hrd"],
  },
  {
    id: "data-diklat",
    label: "Data Diklat",
    icon: BookOpen,
    path: "/data-diklat",
    allowedRoles: ["pegawai"],
  },
  {
    id: "data-keluarga",
    label: "Data Keluarga",
    icon: Users,
    path: "/data-keluarga",
    allowedRoles: ["pegawai"],
  },
  {
    id: "riwayat-karir",
    label: "Riwayat Karir",
    icon: BriefcaseBusiness,
    path: "/riwayat-karir",
    allowedRoles: ["pegawai"],
  },
  {
    id: "manajemen-pegawai",
    label: "Manajemen Pegawai",
    icon: Users,
    path: "/admin",
    allowedRoles: ["admin"],
  },
];
