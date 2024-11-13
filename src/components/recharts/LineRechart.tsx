import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LineRechart({
  data,
  width,
  height,
}: {
  data: { label: string; dataset1: number; dataset2: number }[];
  width?: string | number;
  height?: string | number;
}) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="linear"
          dataKey="dataset1"
          name="Dataset1"
          stroke="#f43f5e"
          strokeWidth={2}
          fillOpacity={0.5}
          dot={true}
        />
        <Line
          type="linear"
          dataKey="dataset2"
          name="Dataset2"
          stroke="#3b82f6" 
          strokeWidth={2}
          fillOpacity={0.5}
          dot={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
