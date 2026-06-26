import RiwayatKarirContainer from "../../../RiwayatKarir/components/RiwayatKarirContainer";
import type { CardPendidikanData } from "../../../../ui/organisms/CardPendidikan/CardPendidikan";
import type { CardJabatanData } from "../../../../ui/organisms/CardJabatan/CardJabatan";
import type { CardPangkatData } from "../../../../ui/organisms/CardPangkat/CardPangkat";
import type { CardStrData } from "../../../../ui/organisms/CardStr/CardStr";
import type { CardSipData } from "../../../../ui/organisms/CardSip/CardSip";
import type { CardPenugasanKlinisData } from "../../../../ui/organisms/CardPenugasanKlinis/CardPenugasanKlinis";

interface TabRiwayatProps {
    jabatanList: CardJabatanData[];
    strList: CardStrData[];
    sipList: CardSipData[];
    penugasanList: CardPenugasanKlinisData[];
    pendidikanList: CardPendidikanData[];
    pangkatList?: CardPangkatData[];
    isAdmin?: boolean;
    pegawaiId?: number;
    onRefresh?: () => void;
    isLoadingJabatan?: boolean;
    isLoadingStr?: boolean;
    isLoadingSip?: boolean;
    isLoadingPenugasan?: boolean;
    isLoadingPendidikan?: boolean;
    isLoadingPangkat?: boolean;
    errorJabatan?: string | null;
    errorStr?: string | null;
    errorSip?: string | null;
    errorPenugasan?: string | null;
    errorPendidikan?: string | null;
    errorPangkat?: string | null;
}

const TabRiwayat = ({
    jabatanList,
    strList,
    sipList,
    penugasanList,
    pendidikanList,
    pangkatList,
    isAdmin,
    pegawaiId,
    onRefresh,
    isLoadingJabatan,
    isLoadingStr,
    isLoadingSip,
    isLoadingPenugasan,
    isLoadingPendidikan,
    isLoadingPangkat,
    errorJabatan,
    errorStr,
    errorSip,
    errorPenugasan,
    errorPendidikan,
    errorPangkat,
}: TabRiwayatProps) => {
    return (
        <RiwayatKarirContainer
            pegawaiId={pegawaiId}
            isAdmin={isAdmin}
            pendidikanListProp={pendidikanList}
            jabatanListProp={jabatanList}
            pangkatListProp={pangkatList}
            strListProp={strList}
            sipListProp={sipList}
            penugasanListProp={penugasanList}
            onRefresh={onRefresh}
            isLoadingProps={{
                pendidikan: isLoadingPendidikan,
                jabatan: isLoadingJabatan,
                pangkat: isLoadingPangkat,
                str: isLoadingStr,
                sip: isLoadingSip,
                penugasan: isLoadingPenugasan,
            }}
            errorProps={{
                pendidikan: errorPendidikan,
                jabatan: errorJabatan,
                pangkat: errorPangkat,
                str: errorStr,
                sip: errorSip,
                penugasan: errorPenugasan,
            }}
        />
    );
};

export default TabRiwayat;
