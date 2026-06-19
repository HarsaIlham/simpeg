import { getGlobalUser } from "../../../contexts/AuthContext";
import DashboardPegawai from "./templates/DashboardPegawai/DashboardPegawai";
import DashboardHrd from "./templates/DashboardHrd/DashboardHrd";
import DashboardAdmin from "./templates/DashboardAdmin/DashboardAdmin";

const DASHBOARD_MAP = {
  pegawai: <DashboardPegawai />,
  hrd: <DashboardHrd />,
  direktur: <DashboardHrd />,
  admin: <DashboardAdmin />,
} as const;

const Home = () => {
  const user = getGlobalUser();

  if (!user) return null;

  return DASHBOARD_MAP[user.role] ?? <DashboardPegawai />;
};

export default Home;