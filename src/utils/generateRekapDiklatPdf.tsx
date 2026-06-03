import ExcelJS from "exceljs";
import { hrdDiklatService } from "../services/hrdDiklatService";

const BULAN_NAMES = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const formatTanggal = (dateStr: string | null): string => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

const applyBorder = (cell: ExcelJS.Cell) => {
    cell.border = {
        top: { style: "thin", color: { argb: "FF808080" } },
        bottom: { style: "thin", color: { argb: "FF808080" } },
        left: { style: "thin", color: { argb: "FF808080" } },
        right: { style: "thin", color: { argb: "FF808080" } },
    };
};

const applyHeaderStyle = (cell: ExcelJS.Cell) => {
    cell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2D5A47" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = {
        top: { style: "thin", color: { argb: "FF808080" } },
        bottom: { style: "thin", color: { argb: "FF808080" } },
        left: { style: "thin", color: { argb: "FF808080" } },
        right: { style: "thin", color: { argb: "FF808080" } },
    };
};

export const generateRekapDiklatExcel = async (
    _allDiklat: any[],
    bulanAwal: number,
    tahunAwal: number,
    bulanAkhir: number,
    tahunAkhir: number,
): Promise<void> => {
    const response = await hrdDiklatService.getLaporanDiklat(bulanAwal, tahunAwal, bulanAkhir, tahunAkhir);

    if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data rekap diklat.");
    }

    const apiData = response.data;
    const rekapDiklat = apiData["Rekap Diklat"];
    const rekapPegawai = apiData["rekap_pegawai"];
    const periodStr = `${BULAN_NAMES[bulanAwal]} ${tahunAwal} — ${BULAN_NAMES[bulanAkhir]} ${tahunAkhir}`;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "SIMPEG RSD Kalisat";
    workbook.created = new Date();

    const sheet1 = workbook.addWorksheet("Rekap Diklat", {
        pageSetup: { orientation: "landscape", paperSize: 9, fitToPage: true },
    });

    const diklatColumns = [
        { header: "No", key: "no", width: 5 },
        { header: "Nama Kegiatan", key: "nama_kegiatan", width: 28 },
        { header: "Jenis Diklat", key: "jenis_diklat", width: 16 },
        { header: "Penyelenggara", key: "penyelenggara", width: 20 },
        { header: "Tanggal Mulai", key: "tanggal_mulai", width: 18 },
        { header: "Tanggal Selesai", key: "tanggal_selesai", width: 18 },
        { header: "Waktu", key: "waktu", width: 10 },
        { header: "Jenis Biaya", key: "jenis_biaya", width: 14 },
        { header: "Biaya/Peserta", key: "biaya_per_peserta", width: 16 },
        { header: "JP", key: "jp", width: 6 },
        { header: "Total Peserta", key: "total_peserta", width: 13 },
        { header: "Peserta Validasi", key: "peserta_validasi", width: 15 },
        { header: "Total Biaya Diklat", key: "total_biaya_diklat", width: 18 },
    ];
    const lastColLetter1 = String.fromCharCode(64 + diklatColumns.length); // M

    sheet1.columns = diklatColumns;

    sheet1.mergeCells(`A1:${lastColLetter1}1`);
    const titleCell1 = sheet1.getCell("A1");
    titleCell1.value = "REKAP DATA DIKLAT";
    titleCell1.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
    titleCell1.alignment = { horizontal: "center", vertical: "middle" };
    titleCell1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2D5A47" } };
    sheet1.getRow(1).height = 30;

    sheet1.mergeCells(`A2:${lastColLetter1}2`);
    const subtitleCell1 = sheet1.getCell("A2");
    subtitleCell1.value = `RSD Kalisat — Kabupaten Jember | Periode: ${periodStr}`;
    subtitleCell1.font = { size: 10, color: { argb: "#000000" } };
    subtitleCell1.alignment = { horizontal: "center", vertical: "middle" };
    sheet1.getRow(2).height = 22;

    sheet1.mergeCells(`A3:${lastColLetter1}3`);
    const summaryCell1 = sheet1.getCell("A3");
    summaryCell1.value = `Total Kegiatan: ${rekapDiklat.total} | Total Biaya Keseluruhan: ${formatCurrency(rekapDiklat["total_biaya keseluruhan"])}`;
    summaryCell1.font = { size: 9, italic: true, color: { argb: "#000000" } };
    summaryCell1.alignment = { horizontal: "center", vertical: "middle" };
    summaryCell1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F7F4" } };
    sheet1.getRow(3).height = 22;

    sheet1.addRow([]);

    const headerRow1 = sheet1.addRow([
        "No", "Nama Kegiatan", "Jenis Diklat", "Penyelenggara",
        "Tanggal Mulai", "Tanggal Selesai", "Waktu",
        "Jenis Biaya", "Biaya/Peserta", "JP", "Total Peserta", "Peserta Validasi",
        "Total Biaya Diklat",
    ]);
    headerRow1.eachCell((cell) => applyHeaderStyle(cell));
    headerRow1.height = 24;

    const diklatItems = rekapDiklat.list_diklat || [];
    diklatItems.forEach((item: any, index: number) => {
        const row = sheet1.addRow([
            index + 1,
            item.nama_kegiatan || "",
            item.jenis_diklat || "",
            item.penyelenggara || "",
            formatTanggal(item.tanggal_mulai),
            formatTanggal(item.tanggal_selesai),
            item.waktu || "-",
            item.jenis_biaya || "-",
            formatCurrency(item["total_biaya per peserta"] ?? 0),
            item.JP ?? 0,
            item["Total Peserta"] ?? 0,
            item["Total Peserta yang udah Validasi"] ?? 0,
            formatCurrency(item["Total Biaya Diklat"] ?? 0),
        ]);

         const isEven = index % 2 === 0;
        row.eachCell((cell, colNumber) => {
            cell.font = { size: 9 };
            cell.alignment = {
                vertical: "middle",
                wrapText: true,
                horizontal: [1, 7, 10, 11, 12].includes(colNumber) ? "center" : "left",
            };
            applyBorder(cell);
            if (isEven) {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };
            }
            if ([9, 13].includes(colNumber)) {
                cell.alignment = { ...cell.alignment, horizontal: "right" };
            }
        });
    });

    let totalJP = 0;
    let totalPeserta = 0;
    let totalPesertaValidasi = 0;
    let totalBiayaDiklat = 0;

    diklatItems.forEach((item: any) => {
        totalJP += Number(item.JP ?? 0);
        totalPeserta += Number(item["Total Peserta"] ?? 0);
        totalPesertaValidasi += Number(item["Total Peserta yang udah Validasi"] ?? 0);
        totalBiayaDiklat += Number(item["Total Biaya Diklat"] ?? 0);
    });

    const jumlahRow = sheet1.addRow([
        "JUMLAH", "", "", "", "", "", "", "", "",
        totalJP,
        totalPeserta,
        totalPesertaValidasi,
        formatCurrency(totalBiayaDiklat),
    ]);
    jumlahRow.height = 24;

    sheet1.mergeCells(`A${jumlahRow.number}:I${jumlahRow.number}`);

    for (let col = 1; col <= 13; col++) {
        const cell = jumlahRow.getCell(col);
        applyBorder(cell);

        if (col <= 9) {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF1F4E79" },
            };
            cell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        } else {
            cell.font = { bold: true, size: 9 };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFFFF" },
            };
            if ([10, 11, 12].includes(col)) {
                cell.alignment = { horizontal: "center", vertical: "middle" };
            } else if (col === 13) {
                cell.alignment = { horizontal: "right", vertical: "middle" };
            }
        }
    }

    const footerRow1 = sheet1.lastRow!.number + 2;
    sheet1.mergeCells(`A${footerRow1}:${lastColLetter1}${footerRow1}`);
    const footerCell1 = sheet1.getCell(`A${footerRow1}`);
    footerCell1.value = `Dicetak pada: ${new Date().toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
    })}`;
    footerCell1.font = { size: 8, italic: true, color: { argb: "FF888888" } };

    const sheet2 = workbook.addWorksheet("Rekap Pegawai", {
        pageSetup: { orientation: "landscape", paperSize: 9, fitToPage: true },
    });

    const pegawaiColumns = [
        { header: "No", key: "no", width: 5 },
        { header: "Nama", key: "nama", width: 26 },
        { header: "NIK", key: "nik", width: 20 },
        { header: "NIP", key: "nip", width: 20 },
        { header: "Unit Kerja", key: "unit_kerja", width: 22 },
        { header: "Nama Kegiatan", key: "nama_kegiatan", width: 28 },
        { header: "Jenis Diklat", key: "jenis_diklat", width: 16 },
        { header: "Penyelenggara", key: "penyelenggara", width: 20 },
        { header: "Tanggal Mulai", key: "tanggal_mulai", width: 18 },
        { header: "Tanggal Selesai", key: "tanggal_selesai", width: 18 },
        { header: "Waktu", key: "waktu", width: 10 },
        { header: "JP", key: "jp", width: 6 },
        { header: "Jenis Biaya", key: "jenis_biaya", width: 14 },
        { header: "Biaya", key: "biaya", width: 16 },
    ];
    const lastColLetter2 = String.fromCharCode(64 + pegawaiColumns.length); // N

    sheet2.columns = pegawaiColumns;

    sheet2.mergeCells(`A1:${lastColLetter2}1`);
    const titleCell2 = sheet2.getCell("A1");
    titleCell2.value = "REKAP PEGAWAI DIKLAT";
    titleCell2.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
    titleCell2.alignment = { horizontal: "center", vertical: "middle" };
    titleCell2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2D5A47" } };
    sheet2.getRow(1).height = 30;

    sheet2.mergeCells(`A2:${lastColLetter2}2`);
    const subtitleCell2 = sheet2.getCell("A2");
    subtitleCell2.value = `RSD Kalisat — Kabupaten Jember | Periode: ${periodStr}`;
    subtitleCell2.font = { size: 10, color: { argb: "#000000" } };
    subtitleCell2.alignment = { horizontal: "center", vertical: "middle" };
    sheet2.getRow(2).height = 22;

    sheet2.mergeCells(`A3:${lastColLetter2}3`);
    const summaryCell2 = sheet2.getCell("A3");
    summaryCell2.value = `Total Pegawai: ${rekapPegawai["total pegawai"]} | Total Biaya: ${formatCurrency(rekapPegawai["total biaya"])}`;
    summaryCell2.font = { size: 9, italic: true, color: { argb: "#000000" } };
    summaryCell2.alignment = { horizontal: "center", vertical: "middle" };
    summaryCell2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F7F4" } };
    sheet2.getRow(3).height = 22;

    sheet2.addRow([]);

    const headerRow2 = sheet2.addRow([
        "No", "Nama", "NIK", "NIP", "Unit Kerja",
        "Nama Kegiatan", "Jenis Diklat", "Penyelenggara",
        "Tanggal Mulai", "Tanggal Selesai", "Waktu", "JP",
        "Jenis Biaya", "Biaya",
    ]);
    headerRow2.eachCell((cell) => applyHeaderStyle(cell));
    headerRow2.height = 24;

    const pegawaiItems = rekapPegawai.list_pegawai || [];
    if (pegawaiItems.length === 0) {
        const emptyRow = sheet2.addRow(["Tidak ada data pegawai untuk periode ini."]);
        sheet2.mergeCells(`A${emptyRow.number}:${lastColLetter2}${emptyRow.number}`);
        const emptyCell = sheet2.getCell(`A${emptyRow.number}`);
        emptyCell.alignment = { horizontal: "center", vertical: "middle" };
        emptyCell.font = { size: 9, italic: true };
        applyBorder(emptyCell);
    } else {
        pegawaiItems.forEach((item: any, index: number) => {
            const row = sheet2.addRow([
                index + 1,
                item["Nama Orang"] || "",
                item["NIK"] || "",
                item["NIP"] || "-",
                item["unit kerja"] || "",
                item["nama_kegiatan"] || "",
                item["jenis_diklat"] || "",
                item["penyelenggara"] || "",
                formatTanggal(item["tanggal_mulai"]),
                formatTanggal(item["tanggal_selesai"]),
                item["waktu"] || "-",
                item["jp"] ?? 0,
                item["jenis_biaya"] || "-",
                formatCurrency(item["biaya"] ?? 0),
            ]);

            const isEven = index % 2 === 0;
            row.eachCell((cell, colNumber) => {
                cell.font = { size: 9 };
                cell.alignment = {
                    vertical: "middle",
                    wrapText: true,
                    horizontal: [1, 3, 4, 11, 12].includes(colNumber) ? "center" : "left",
                };
                applyBorder(cell);
                if (isEven) {
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };
                }
                if (colNumber === 14) {
                    cell.alignment = { ...cell.alignment, horizontal: "right" };
                }
            });
        });
    }

    const footerRow2 = sheet2.lastRow!.number + 2;
    sheet2.mergeCells(`A${footerRow2}:${lastColLetter2}${footerRow2}`);
    const footerCell2 = sheet2.getCell(`A${footerRow2}`);
    footerCell2.value = `Dicetak pada: ${new Date().toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
    })}`;
    footerCell2.font = { size: 8, italic: true, color: { argb: "FF888888" } };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Rekap_Diklat_${BULAN_NAMES[bulanAwal]}_${tahunAwal}_${BULAN_NAMES[bulanAkhir]}_${tahunAkhir}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
