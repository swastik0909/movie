import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Stats {
    Skip: number;
    Timepass: number;
    "Go for it": number;
    Perfection: number;
    percentage: number;
}

const COLORS = {
    Skip: "#EF4444", // Red-500
    Timepass: "#EAB308", // Yellow-500
    "Go for it": "#22C55E", // Green-500
    Perfection: "#A855F7", // Purple-500
};

const RatingGauge = ({ stats }: { stats: Stats }) => {
    const data = [
        { name: "Skip", value: stats.Skip, color: COLORS.Skip },
        { name: "Timepass", value: stats.Timepass, color: COLORS.Timepass },
        { name: "Go for it", value: stats["Go for it"], color: COLORS["Go for it"] },
        { name: "Perfection", value: stats.Perfection, color: COLORS.Perfection },
    ];

    // Calculate total votes
    const totalVotes = data.reduce((acc, curr) => acc + curr.value, 0);

    // Data for the semi-circle gauge (Background track vs Progress)
    // We actually want to show the DISTRIBUTION, so we just show the pie segments.
    // To make it a semi-circle, startAngle=180, endAngle=0.

    return (
        <div className="flex flex-col items-center bg-[#0F0F0F] p-6 rounded-2xl w-full max-w-md mx-auto">
            {/* GAUGE CHART */}
            <div className="relative w-full flex justify-center">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={2}
                            dataKey="value"
                            cornerRadius={6}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1F1F1F",
                                border: "none",
                                borderRadius: "8px",
                                color: "#fff",
                            }}
                            itemStyle={{ color: "#fff" }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* CENTER TEXT */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center">
                    <div className="text-5xl font-bold text-white">
                        {stats.percentage}%
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                        {totalVotes} Votes
                    </div>
                </div>
            </div>

            {/* LEGEND */}
            <div className="flex justify-between w-full mt-6 px-4">
                {data.map((item) => (
                    <div key={item.name} className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-gray-400 font-medium">
                                {item.name}
                            </span>
                        </div>
                        <span className="text-sm font-bold text-white">
                            {totalVotes > 0 ? Math.round((item.value / totalVotes) * 100) : 0}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingGauge;
