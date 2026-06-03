import { FileText, Download, Upload } from "lucide-react";
import styles from "./DocumentPreview.module.css";
import Button from "../../atoms/Button";
import { getFileUrl } from "../../../../utils/api";

interface DocumentPreviewProps {
    imgSrc?: string | null;
    altText?: string;
    onUploadClick?: () => void;
    isUploading?: boolean;
}

const DocumentPreview = ({
    imgSrc,
    altText = "Dokumen",
    onUploadClick,
    isUploading = false,
}: DocumentPreviewProps) => {
    const isPdf = imgSrc?.toLowerCase().endsWith(".pdf");
    const fullUrl = getFileUrl(imgSrc);

    const handleDownload = () => {
        if (!fullUrl) return;
        window.open(fullUrl, "_blank");
    };

    return (
        <div className={styles.container}>
            {imgSrc ? (
                isPdf ? (
                    <div className={styles.pdfInfo}>
                        <div className={styles.pdfIcon}>
                            <FileText size={56} />
                        </div>
                        <span className={styles.pdfFileName}>
                            {altText}
                        </span>
                        <span className={styles.pdfHint}>
                            File tersedia dalam format PDF
                        </span>
                    </div>
                ) : (
                    <div className={styles.imageWrapper}>
                        <img
                            src={fullUrl}
                            alt={altText}
                            className={styles.image}
                        />
                    </div>
                )
            ) : (
                <div className={styles.imageWrapper}>
                    <div className={styles.fallback}>
                        <FileText size={48} />
                        <span className={styles.fallbackText}>Belum ada dokumen</span>
                    </div>
                </div>
            )}

            <div className={styles.actions}>
                {imgSrc && isPdf && (
                    <Button
                        label={`Unduh ${altText}`}
                        icon={<Download size={18} />}
                        variant="info"
                        onClick={handleDownload}
                        fullWidth
                    />
                )}

                {onUploadClick && (
                    <Button
                        label={isUploading ? "Mengupload..." : `Update ${altText}`}
                        icon={<Upload size={18} />}
                        variant="primary"
                        onClick={onUploadClick}
                        disabled={isUploading}
                        fullWidth
                    />
                )}
            </div>
        </div>
    );
};

export default DocumentPreview;
