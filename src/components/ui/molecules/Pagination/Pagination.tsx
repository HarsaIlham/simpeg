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

    const pageItems = useMemo(() => {
        const items: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i);
            }
        } else {
            items.push(1);

            if (activePage > 3) {
                items.push("...");
            }

            const start = Math.max(2, activePage - 1);
            const end = Math.min(totalPages - 1, activePage + 1);

            let adjustedStart = start;
            let adjustedEnd = end;
            if (activePage <= 3) {
                adjustedEnd = 4;
            } else if (activePage >= totalPages - 2) {
                adjustedStart = totalPages - 3;
            }

            for (let i = adjustedStart; i <= adjustedEnd; i++) {
                if (i > 1 && i < totalPages) {
                    items.push(i);
                }
            }

            if (activePage < totalPages - 2) {
                items.push("...");
            }

            items.push(totalPages);
        }
        return items;
    }, [totalPages, activePage]);

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
                {pageItems.map((item, index) => {
                    if (item === "...") {
                        return (
                            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                                ...
                            </span>
                        );
                    }
                    return (
                        <button
                            key={item}
                            className={`${styles.pageNum} ${activePage === item ? styles.pageNumActive : ""}`}
                            onClick={() => onPageChange(item as number)}
                        >
                            {item}
                        </button>
                    );
                })}
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
