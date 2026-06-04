import { useAuth } from "../../../contexts/AuthContext";
import PegawaiAdmin from "./templates/PegawaiAdmin";
import PegawaiHrd from "./templates/PegawaiHrd";

const PEGAWAI_MAP = {
  pegawai: null,
  hrd: <PegawaiHrd />,
  direktur: <PegawaiHrd />,
  admin: <PegawaiAdmin />,
} as const;

const Pegawai = () => {
  const { user } = useAuth();

  if (!user) return null;

  return PEGAWAI_MAP[user.role] ?? null;
};

export default Pegawai;