import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { CvData } from "../services/cvService";


const formatTanggal = (dateStr: string): string => {
  if (!dateStr || dateStr === "-") return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatJk = (jk: string): string => {
  if (jk === "L") return "Laki-laki";
  if (jk === "P") return "Perempuan";
  return jk;
};


const s = StyleSheet.create({
  page: {
    padding: "20mm 25mm",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1a1a1a",
  },

  header: {
    textAlign: "center",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    borderBottomStyle: "solid",
  },
  headerName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  headerContact: {
    fontSize: 9,
    color: "#444",
  },

  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: "#333",
    marginBottom: 6,
  },
  paragraph: {
    textAlign: "justify",
    marginBottom: 4,
  },

  dataRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  dataLabel: {
    width: 160,
  },
  dataSep: {
    width: 12,
  },
  dataValue: {
    flex: 1,
  },

  pendidikanItem: {
    marginBottom: 3,
  },
  diklatItem: {
    marginBottom: 5,
  },
  diklatBold: {
    fontFamily: "Helvetica-Bold",
  },

  sertifikasiItem: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 10,
  },
  bullet: {
    width: 12,
  },
  sertifikasiText: {
    flex: 1,
  },

  footer: {
    marginTop: 24,
  },
  italic: {
    fontFamily: "Helvetica-Oblique",
    marginBottom: 3,
  },
  footerLine: {
    marginBottom: 2,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
});

const Header = ({ data }: { data: CvData }) => {
  const { header } = data;
  const parts = [header.alamat, header.no_telp, header.email].filter(Boolean);

  return (
    <View style={s.header}>
      <Text style={s.headerName}>{header.nama}</Text>
      <Text style={s.headerContact}>{parts.join(" | ")}</Text>
    </View>
  );
};

const SectionProfil = ({ data }: { data: CvData }) => {
  const { profil } = data;
  const jabatan = profil.jabatan || "pegawai";
  const unitKerja = profil.unit_kerja || "RSD Kalisat";

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>PROFIL</Text>
      <View style={s.sectionDivider} />
      <Text style={s.paragraph}>
        Tenaga kesehatan dengan jabatan {jabatan} di {unitKerja}, Kabupaten
        Jember. Aktif mengikuti pelatihan dan pendidikan berkelanjutan guna
        meningkatkan kompetensi klinis dan profesionalisme dalam pelayanan
        kesehatan publik. Masa kerja tercatat {profil.masa_kerja}.
      </Text>
    </View>
  );
};

const DataDiriRow = ({ label, value }: { label: string; value: string }) => (
  <View style={s.dataRow}>
    <Text style={s.dataLabel}>{label}</Text>
    <Text style={s.dataSep}>:</Text>
    <Text style={s.dataValue}>{value}</Text>
  </View>
);

const SectionDataDiri = ({ data }: { data: CvData }) => {
  const { data_diri } = data;

  const fields = [
    { label: "NIP", value: data_diri.nip },
    { label: "NIK", value: data_diri.nik },
    { label: "Tempat, Tgl Lahir", value: data_diri.tanggal_lahir ? `Jember, ${formatTanggal(data_diri.tanggal_lahir)}` : "-" },
    { label: "Jenis Kelamin", value: formatJk(data_diri.jenis_kelamin) },
    { label: "Golongan / Pangkat", value: `${data_diri.golongan_ruang || "-"} / ${data_diri.pangkat || "-"}` },
    { label: "Jabatan", value: data_diri.jabatan || "-" },
    { label: "Unit Kerja", value: data_diri.unit_kerja || "-" },
    { label: "TMT PNS", value: data_diri.tmt_pns ? formatTanggal(data_diri.tmt_pns) : "-" },
    { label: "Status Kepegawaian", value: data_diri.status_kepegawaian || "-" },
  ];

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>DATA DIRI</Text>
      <View style={s.sectionDivider} />
      {fields.map((f) => (
        <DataDiriRow key={f.label} label={f.label} value={f.value} />
      ))}
    </View>
  );
};

const SectionPendidikan = ({ data }: { data: CvData }) => {
  const { pendidikan } = data;

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>PENDIDIKAN</Text>
      <View style={s.sectionDivider} />
      {pendidikan.length === 0 ? (
        <Text style={s.italic}>Belum ada data pendidikan.</Text>
      ) : (
        pendidikan.map((p, index) => (
          <Text key={index} style={s.pendidikanItem}>
            {p.jenjang} {p.jurusan} — {p.institusi} | {p.tahun_lulus}
          </Text>
        ))
      )}
    </View>
  );
};

const SectionJabatan = ({ data }: { data: CvData }) => {
  const { riwayat_jabatan } = data;

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>RIWAYAT JABATAN</Text>
      <View style={s.sectionDivider} />
      {riwayat_jabatan.length === 0 ? (
        <Text style={s.italic}>Belum ada data riwayat jabatan.</Text>
      ) : (
        riwayat_jabatan.map((j, i) => {
          const selesai = j.is_current ? "Sekarang" : (j.tanggal_selesai && j.tanggal_selesai !== "-" ? formatTanggal(j.tanggal_selesai) : "-");
          return (
            <View key={i} style={s.diklatItem}>
              <Text>
                <Text style={s.diklatBold}>{j.jabatan}</Text> — {j.unit_kerja || "-"}
              </Text>
              <Text>
                {formatTanggal(j.tanggal_mulai)} s.d. {selesai}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
};

const SectionDiklat = ({ data }: { data: CvData }) => {
  const { diklat } = data;

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>RIWAYAT DIKLAT & PELATIHAN</Text>
      <View style={s.sectionDivider} />
      {diklat.length === 0 ? (
        <Text style={s.italic}>Belum ada riwayat diklat.</Text>
      ) : (
        diklat.map((d, i) => {
          const tanggal = `${formatTanggal(d.tanggal_mulai)}–${formatTanggal(d.tanggal_selesai)}`;
          return (
            <View key={i} style={s.diklatItem}>
              <Text>
                <Text style={s.diklatBold}>{d.nama}</Text>
                {" "}{d.jenis} | {d.pelaksana} | {tanggal} | {d.jp} JP
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
};

const SectionStr = ({ data }: { data: CvData }) => {
  const { str } = data;

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>SURAT TANDA REGISTRASI (STR)</Text>
      <View style={s.sectionDivider} />
      {str.length === 0 ? (
        <Text style={s.italic}>Belum ada data STR.</Text>
      ) : (
        str.map((item, i) => {
          const berlaku = item.tanggal_kadaluarsa
            ? `Berlaku s/d ${formatTanggal(item.tanggal_kadaluarsa)}`
            : "Berlaku";
          return (
            <View key={i} style={s.sertifikasiItem}>
              <Text style={s.bullet}>•</Text>
              <Text style={s.sertifikasiText}>
                STR — No. {item.nomor_str} | {berlaku} | {item.is_current ? "Aktif" : "Tidak Aktif"}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
};

const SectionSip = ({ data }: { data: CvData }) => {
  const { sip } = data;

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>SURAT IZIN PRAKTIK (SIP)</Text>
      <View style={s.sectionDivider} />
      {sip.length === 0 ? (
        <Text style={s.italic}>Belum ada data SIP.</Text>
      ) : (
        sip.map((item, i) => {
          const berlaku = item.tanggal_kadaluarsa
            ? `Berlaku s/d ${formatTanggal(item.tanggal_kadaluarsa)}`
            : "Berlaku";
          return (
            <View key={i} style={s.sertifikasiItem}>
              <Text style={s.bullet}>•</Text>
              <Text style={s.sertifikasiText}>
                {item.jenis_sip} — No. {item.nomor_sip} | {berlaku} | {item.is_current ? "Aktif" : "Tidak Aktif"}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
};

const SectionPenugasanKlinis = ({ data }: { data: CvData }) => {
  const { penugasan_klinis } = data;

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>PENUGASAN KLINIS</Text>
      <View style={s.sectionDivider} />
      {penugasan_klinis.length === 0 ? (
        <Text style={s.italic}>Belum ada data penugasan klinis.</Text>
      ) : (
        penugasan_klinis.map((pk, i) => {
          const kadaluarsa = pk.tanggal_kadaluarsa
            ? formatTanggal(pk.tanggal_kadaluarsa)
            : "-";
          return (
            <View key={i} style={s.sertifikasiItem}>
              <Text style={s.bullet}>•</Text>
              <Text style={s.sertifikasiText}>
                No. {pk.nomor_surat} | {formatTanggal(pk.tanggal_mulai)} s.d. {kadaluarsa} | {pk.is_current ? "Aktif" : "Tidak Aktif"}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
};

const Footer = ({ data }: { data: CvData }) => {
  const { header, data_diri, ttd } = data;

  return (
    <View style={s.footer}>
      <Text style={s.italic}>Demikian CV ini dibuat dengan sebenar-benarnya.</Text>
      <Text style={s.footerLine}>{ttd.kota}, {formatTanggal(ttd.tanggal)}</Text>
      <Text style={s.footerLine}>
        <Text style={s.bold}>{header.nama}</Text> NIP. {data_diri.nip}
      </Text>
    </View>
  );
};

const CvDocument = ({ data }: { data: CvData }) => (
  <Document>
    <Page size="A4" style={s.page}>
      <Header data={data} />
      <SectionProfil data={data} />
      <SectionDataDiri data={data} />
      <SectionPendidikan data={data} />
      <SectionJabatan data={data} />
      <SectionDiklat data={data} />
      <SectionStr data={data} />
      <SectionSip data={data} />
      <SectionPenugasanKlinis data={data} />
      <Footer data={data} />
    </Page>
  </Document>
);

export const generateCvPdf = async (data: CvData): Promise<void> => {
  const blob = await pdf(<CvDocument data={data} />).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `CV_${data.header.nama.replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
