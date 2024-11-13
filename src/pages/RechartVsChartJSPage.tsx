import { Helmet } from "react-helmet-async";
import LineChartJS from "../components/chartjs/LineChartJS";
import LineRechart from "../components/recharts/LineRechart";

const hexToRGBA = (hex: string, alpha: number) => {
  let r = 0,
    g = 0,
    b = 0;
  // 3 digits hex
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits hex
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function RechartVsChartJSPage() {
  const data = [
    { label: "Jan", dataset1: 10, dataset2: 105 },
    { label: "Feb", dataset1: 15, dataset2: 215 },
    { label: "Mar", dataset1: 9, dataset2: 99 },
    { label: "Apr", dataset1: 21, dataset2: 212 },
    { label: "May", dataset1: 33, dataset2: 335 },
    { label: "Jun", dataset1: 47, dataset2: 407 },
    { label: "Jul", dataset1: 66, dataset2: 667 },
    { label: "Aug", dataset1: 72, dataset2: 722 },
    { label: "Sep", dataset1: 42, dataset2: 402 },
    { label: "Oct", dataset1: 25, dataset2: 259 },
    { label: "Nov", dataset1: 11, dataset2: 111 },
    { label: "Dec", dataset1: 38, dataset2: 385 },
  ];

  const chartJsData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "Dataset1",
        data: data.map((item) => item.dataset1),
        borderColor: "#f43f5e",
        backgroundColor: hexToRGBA("#f43f5e", 0.5),
        tension: 0,
      },
      {
        label: "Dataset2",
        data: data.map((item) => item.dataset2),
        borderColor: "#3b82f6",
        backgroundColor: hexToRGBA("#3b82f6", 0.5),
        tension: 0,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Rechart vs Chart.js</title>
      </Helmet>
      <LineRechart data={data} height={400} />
      <LineChartJS data={chartJsData} height={400} />
    </>
  );
}
