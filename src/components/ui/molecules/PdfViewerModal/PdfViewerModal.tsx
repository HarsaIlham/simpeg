import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText } from "lucide-react";
import Modal from "../../organisms/Modal";
import Button from "../../atoms/Button";
import styles from "./PdfViewerModal.module.css";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string | null;
    title?: string;
    fileName?: string;
    extraActions?: React.ReactNode;
}

const PdfViewerModal = ({
    isOpen,
    onClose,
    fileUrl,
    title = "Lihat Dokumen",
    fileName,
    extraActions,
}: PdfViewerModalProps) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.2);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
        setIsLoading(false);
        setError(null);
    }, []);

    const onDocumentLoadError = useCallback(() => {
        setIsLoading(false);
        setError("Gagal memuat dokumen PDF. Silakan coba lagi.");
    }, []);

    const goToPrevPage = () => {
        setPageNumber((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber((prev) => Math.min(prev + 1, numPages));
    };

    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.2, 2.5));
    };

    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.2, 0.5));
    };

    const handleDownload = async () => {
        if (!fileUrl) return;
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName || fileUrl.split("/").pop() || "dokumen";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch {
            window.open(fileUrl, "_blank");
        }
    };

    const handleClose = () => {
        setPageNumber(1);
        setNumPages(0);
        setScale(1.2);
        setIsLoading(true);
        setError(null);
        onClose();
    };

    if (!isOpen || !fileUrl) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={title} className={styles.wideModal}>
            <div className={styles.container}>
                <div className={styles.viewerArea}>
                    {isPdf ? (
                        <>
                            {isLoading && (
                                <div className={styles.loadingState}>
                                    <div className={styles.spinner} />
                                    <span>Memuat dokumen...</span>
                                </div>
                            )}

                            {error && (
                                <div className={styles.errorState}>
                                    <FileText size={48} />
                                    <span>{error}</span>
                                    <Button
                                        label="Coba Lagi"
                                        variant="primary"
                                        size="sm"
                                        onClick={() => {
                                            setError(null);
                                            setIsLoading(true);
                                        }}
                                    />
                                </div>
                            )}

                            <div
                                className={styles.pdfWrapper}
                                style={{ display: isLoading || error ? "none" : "flex" }}
                            >
                                <Document
                                    file={fileUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={onDocumentLoadError}
                                    loading={null}
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                    />
                                </Document>
                            </div>
                        </>
                    ) : (
                        /* Image viewer for non-PDF files */
                        <div className={styles.imageWrapper}>
                            <img
                                src={fileUrl}
                                alt={title}
                                className={styles.image}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                    setError("Gagal memuat gambar.");
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Toolbar */}
                <div className={styles.toolbar}>
                    {isPdf && !error && !isLoading && (
                        <>
                            {/* Pagination */}
                            <div className={styles.pagination}>
                                <button
                                    className={styles.toolbarButton}
                                    onClick={goToPrevPage}
                                    disabled={pageNumber <= 1}
                                    aria-label="Halaman sebelumnya"
                                    type="button"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className={styles.pageInfo}>
                                    {pageNumber} / {numPages}
                                </span>
                                <button
                                    className={styles.toolbarButton}
                                    onClick={goToNextPage}
                                    disabled={pageNumber >= numPages}
                                    aria-label="Halaman berikutnya"
                                    type="button"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            {/* Zoom controls */}
                            <div className={styles.zoomControls}>
                                <button
                                    className={styles.toolbarButton}
                                    onClick={handleZoomOut}
                                    disabled={scale <= 0.5}
                                    aria-label="Perkecil"
                                    type="button"
                                >
                                    <ZoomOut size={18} />
                                </button>
                                <span className={styles.zoomInfo}>
                                    {Math.round(scale * 100)}%
                                </span>
                                <button
                                    className={styles.toolbarButton}
                                    onClick={handleZoomIn}
                                    disabled={scale >= 2.5}
                                    aria-label="Perbesar"
                                    type="button"
                                >
                                    <ZoomIn size={18} />
                                </button>
                            </div>
                        </>
                    )}

                    {/* Download button */}
                    <Button
                        label="Download"
                        icon={<Download size={16} />}
                        variant="primary"
                        size="sm"
                        onClick={handleDownload}
                    />

                    {extraActions}
                </div>
            </div>
        </Modal>
    );
};

export default PdfViewerModal;
