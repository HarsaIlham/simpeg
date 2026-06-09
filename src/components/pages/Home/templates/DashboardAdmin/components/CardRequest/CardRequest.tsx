import Card from "../../../../../../ui/atoms/Card";
import styles from "./CardRequest.module.css";
import Text from "../../../../../../ui/atoms/Text";
import Button from "../../../../../../ui/atoms/Button";
import Badge from "../../../../../../ui/atoms/Badge";
import { formatRelativeDate } from "../../../../../../../utils/dateUtils";

export interface CardRequestData {
    id: number;
    sender: string;
    senderRole: string;
    fitur: string;
    status: "pending" | "approved" | "rejected";
    note: string | null;
    jumlahDetail: number;
    tanggalPengajuan: string;
}

interface CardRequestProps {
    data: CardRequestData;
    onTinjau?: () => void;
}

const statusConfig: Record<string, { label: string; variant: "warning" | "success" | "danger" }> = {
    pending: { label: "Menunggu", variant: "warning" },
    approved: { label: "Disetujui", variant: "success" },
    rejected: { label: "Ditolak", variant: "danger" },
};

const CardRequest = ({ data, onTinjau }: CardRequestProps) => {
    const config = statusConfig[data.status] || statusConfig.pending;

    return (
        <Card className={styles.card}>
            <div className={styles.info}>
                <Text
                    text={`${data.sender} — ${data.fitur}`}
                    weight="bold"
                    fontSize="16px"
                />
                <Text
                    text={`${data.senderRole} · Diajukan ${formatRelativeDate(data.tanggalPengajuan)} · ${data.jumlahDetail} perubahan`}
                    fontSize="13px"
                    color="green"
                />
                {data.note && (
                    <Text
                        text={`Catatan: ${data.note}`}
                        fontSize="13px"
                        color="default"
                    />
                )}
            </div>
            <div className={styles.actions}>
                <Badge variant={config.variant}>{config.label}</Badge>
                {data.status === "pending" && (
                    <Button
                        variant="primary"
                        label="Detail"
                        className={styles.button}
                        onClick={onTinjau}
                    />
                )}
            </div>
        </Card>
    );
};

export default CardRequest;