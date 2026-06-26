import Topbar from "../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection";
import Icon from "../../ui/atoms/Icon";
import { TrendingUp } from "lucide-react";
import RiwayatKarirContainer from "./components/RiwayatKarirContainer";

const RiwayatKarir = () => {
  return (
    <>
      <Topbar title="Riwayat Karir" />
      <MainHeaderSection
        children={<Icon icon={TrendingUp} variant="transparant" sizeIcon="sm" />}
        title="Riwayat Karir"
        subtitle="Kelola informasi pendidikan, jabatan, pangkat, STR dan SIP"
      />
      <RiwayatKarirContainer isAdmin={true} />
    </>
  );
};

export default RiwayatKarir;