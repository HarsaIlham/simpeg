import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import ChartCard from "../../atoms/ChartCard";
import type { ChartDataItem } from "../../../../types/api";
import styles from "./PieChartWidget.module.css";

interface PieChartWidgetProps {
    title: string;
    data: ChartDataItem[];
    isLoading?: boolean;
}

const COLORS = [
    "#176d49",
    "#1a8a5c",
    "#2da872",
    "#4ec48e",
    "#7ed8ac",
    "#a8e6c3",
    "#c8f0d8",
    "#0F3D2E",
];

const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
}: any) => {
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#17352a"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={11}
            fontWeight={600}
        >
            {`${name}: ${(percent * 100).toFixed(0)} %`}
        </text>
    );
};

const PieChartWidget = ({
    title,
    data,
    isLoading = false,
}: PieChartWidgetProps) => {
    if (isLoading) {
        return (
            <ChartCard title={title}>
                <div className={styles.skeleton}>
                    <div className={styles.skeletonCircle} />
                </div>
            </ChartCard>
        );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <ChartCard title={title}>
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={90}
                        paddingAngle={0}
                        dataKey="value"
                        nameKey="label"
                        label={renderCustomLabel}
                        labelLine={true}
                        stroke="#fff"
                        strokeWidth={1.5}
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #D6E3DC",
                            borderRadius: "8px",
                            fontSize: "13px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                        formatter={(value, name) => [
                            `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                            name,
                        ]}
                    />
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                            <span style={{ color: "#17352a", fontSize: "12px" }}>{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default PieChartWidget;
