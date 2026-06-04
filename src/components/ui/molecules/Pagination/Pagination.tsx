import { useMemo } from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    itemName?: string;
}

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    itemName = "data",
}: PaginationProps) => {
    const activePage = Math.min(currentPage, totalPages);
    const startItem = totalItems > 0 ? (activePage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(activePage * itemsPerPage, totalItems);

    const pageNumbers = useMemo(
        () => Array.from({ length: totalPages }, (_, i) => i + 1),
        [totalPages]
    );

    return (
        <div className={styles.paginationRow}>
            <div>
                Menampilkan {startItem} hingga {endItem} dari {totalItems} {itemName}
            </div>
            <div className={styles.paginationButtons}>
                <button
                    className={styles.pageBtn}
                    onClick={() => onPageChange(Math.max(activePage - 1, 1))}
                    disabled={activePage === 1}
                >
                    Sebelumnya
                </button>
                {pageNumbers.map((pageNum) => (
                    <button
                        key={pageNum}
                        className={`${styles.pageNum} ${activePage === pageNum ? styles.pageNumActive : ""}`}
                        onClick={() => onPageChange(pageNum)}
                    >
                        {pageNum}
                    </button>
                ))}
                <button
                    className={styles.pageBtn}
                    onClick={() => onPageChange(Math.min(activePage + 1, totalPages))}
                    disabled={activePage === totalPages}
                >
                    Selanjutnya
                </button>
            </div>
        </div>
    );
};

export default Pagination;
