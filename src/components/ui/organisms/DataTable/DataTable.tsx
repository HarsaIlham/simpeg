import type { ReactNode } from "react";
import styles from "./DataTable.module.css";

export interface Column<T> {
    key: string;
    label: string;
    width?: string;
    align?: "left" | "center" | "right";
    render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    rowKey: (row: T) => string | number;
    emptyMessage?: string;
    maxVisibleRows?: number;
}

const ROW_HEIGHT = 72;

const DataTable = <T,>({
    columns,
    data,
    rowKey,
    emptyMessage = "Tidak ada data.",
    maxVisibleRows = 10,
}: DataTableProps<T>) => {
    const maxBodyHeight = maxVisibleRows * ROW_HEIGHT;

    return (
        <div className={styles.tableContainer}>
            <div
                className={styles.bodyScroll}
                style={{ maxHeight: `${maxBodyHeight + ROW_HEIGHT}px` }}
            >
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={styles.th}
                                    style={{
                                        ...(col.width ? { width: col.width } : {}),
                                        ...(col.align ? { textAlign: col.align } : {}),
                                    }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className={styles.emptyState}
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={rowKey(row)} className={styles.tr}>
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={styles.td}
                                            style={{
                                                ...(col.width ? { width: col.width } : {}),
                                                ...(col.align ? { textAlign: col.align } : {}),
                                            }}
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : String((row as Record<string, unknown>)[col.key] ?? "—")}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
