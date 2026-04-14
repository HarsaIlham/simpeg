import type { LucideIcon } from "lucide-react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
  children?: SidebarMenuItem[];
  disabled?: boolean;
  permission?: string;
  allowedRoles?: string[];
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

