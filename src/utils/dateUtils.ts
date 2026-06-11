export const formatRelativeDate = (dateString: string): string => {
    const now = new Date();
    const target = new Date(dateString);

    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());

    const diffMs = nowMidnight.getTime() - targetMidnight.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Hari ini";
    if (diffDays === 1) return "1 hari yang lalu";
    if (diffDays <= 7) return `${diffDays} hari yang lalu`;

    return target.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export const formatLongDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
};

const BULAN_MAP: Record<string, string> = {
    januari: "01", februari: "02", maret: "03", april: "04",
    mei: "05", juni: "06", juli: "07", agustus: "08",
    september: "09", oktober: "10", november: "11", desember: "12",
    january: "01", february: "02", march: "03", may: "05",
    june: "06", july: "07", august: "08", october: "10",
    december: "12",
};

export const parseLocalDateToISO = (dateStr: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.trim().split(/[\s\/\-\.]+/);
    if (parts.length !== 3) return "";

    const [day, month, year] = parts;
    
    let mm = "";
    if (isNaN(Number(month))) {
        mm = BULAN_MAP[month.toLowerCase()];
    } else {
        mm = month.padStart(2, "0");
    }
    
    if (!mm || Number(mm) < 1 || Number(mm) > 12) return "";

    let cleanDay = day;
    let cleanYear = year;
    if (day.length === 4) {
        cleanDay = year;
        cleanYear = day;
    }
    
    const dd = cleanDay.padStart(2, "0");
    const yyyy = cleanYear;
    
    if (yyyy.length !== 4) return "";

    return `${yyyy}-${mm}-${dd}`;
};

export const calculateAge = (dateStr: string): string => {
    if (!dateStr) return "";

    const birthDate = new Date(dateStr);
    if (isNaN(birthDate.getTime())) return "";

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age === 0) {
        let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
        months -= birthDate.getMonth();
        months += today.getMonth();

        if (today.getDate() < birthDate.getDate()) {
            months--;
        }

        if (months < 0 || birthDate > today) return "0 Bulan";

        return `${months} Bulan`;
    }

    return age > 0 ? `${age} Tahun` : "";
};

export const hitungMasaKerja = (tanggalMasuk: string): string => {
    if (!tanggalMasuk) return "-";

    const start = new Date(tanggalMasuk);
    if (isNaN(start.getTime())) return "-";

    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }
    if (now.getDate() < start.getDate()) {
        months--;
        if (months < 0) {
            years--;
            months += 12;
        }
    }

    if (years <= 0 && months <= 0) return "< 1 Bulan";
    if (years <= 0) return `${months} Bulan`;
    if (months <= 0) return `${years} Tahun`;
    return `${years} Tahun ${months} Bulan`;
};
