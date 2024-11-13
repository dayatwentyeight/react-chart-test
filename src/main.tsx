import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import Layout from "./Layout.tsx";
import RechartVsChartJSPage from "./pages/RechartVsChartJSPage.tsx";
import NetworkChartPage from "./pages/NetworkChartPage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/rechart-vs-chartjs",
        element: <RechartVsChartJSPage />,
      },
      {
        path: "/network-chart",
        element: <NetworkChartPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
);
