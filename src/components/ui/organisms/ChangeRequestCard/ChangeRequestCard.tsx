import Card from "../../atoms/Card";
import CardHeader from "../../molecules/CardHeader";
import RequestItem from "../../molecules/RequestItem";
import styles from "./ChangeRequestCard.module.css";

export interface ChangeRequestData {
    id: string;
    title: string;
    date: string;
    statusLabel: string;
    statusVariant: "info" | "success" | "warning" | "danger" | "default";
}

interface propsType {
    requests: ChangeRequestData[];
}

const ChangeRequestCard = ({ requests }: propsType) => {
  return (
    <Card>
      <CardHeader title="Status Perubahan Data" />
      
      <div className={styles.listContainer}>
        {requests.length > 0 ? (
          requests.map((req) => (
            <RequestItem
              key={req.id}
              title={req.title}
              date={req.date}
              statusLabel={req.statusLabel}
              statusVariant={req.statusVariant}
            />
          ))
        ) : (
          <div className={styles.emptyState}>Belum ada riwayat pengajuan.</div>
        )}
      </div>
    </Card>
  );
};

export default ChangeRequestCard;