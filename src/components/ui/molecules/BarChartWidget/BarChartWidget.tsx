import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import ChartCard from "../../atoms/ChartCard";
import type { ChartDataItem } from "../../../../types/api";
import styles from "./BarChartWidget.module.css";

interface BarChartWidgetProps {
    title: string;
    data: ChartDataItem[];
    color?: string;
    isLoading?: boolean;
}

const BarChartWidget = ({
    title,
    data,
    color = "#176d49",
    isLoading = false,
}: BarChartWidgetProps) => {
    if (isLoading) {
        return (
            <ChartCard title={title}>
                <div className={styles.skeleton}>
                    <div className={styles.skeletonBars}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className={styles.skeletonBar}
                                style={{ height: `${30 + Math.random() * 50}%` }}
                            />
                        ))}
                    </div>
                </div>
            </ChartCard>
        );
    }

    return (
        <ChartCard title={title}>
            <ResponsiveContainer width="100%" height={240}>
                <BarChart
                    data={data}
                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8efe8" />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: "#000000ff" }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={50}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "#6b8f7b" }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #D6E3DC",
                            borderRadius: "8px",
                            fontSize: "13px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                        cursor={{ fill: "rgba(23, 109, 73, 0.06)" }}
                        formatter={(value) => [value, "Jumlah"]}
                        labelFormatter={(label) => label}
                    />
                    <Bar
                        dataKey="value"
                        fill={color}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default BarChartWidget;
