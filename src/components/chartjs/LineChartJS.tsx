import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChartJS({
  data,
  options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  },
  width,
  height,
}: {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
  width?: string | number;
  height?: string | number
}) {
  return (
    <div style={{ width, height }}>
      <Line data={data} options={options} />
    </div>
  );
}
