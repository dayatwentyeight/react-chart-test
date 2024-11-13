import { Helmet } from "react-helmet-async";
import NetworkChart from "../components/network/NetworkChart";

function formatTooltip(article: {
  title: string;
  authors: string;
  year: string;
}) {
  return `
    <div>
      <div>
        <strong>${article.title}</strong>
        (${article.year})
      <div>
      <div>${article.authors}</div>
    </div>
  `;
}

export default function NetworkChartPage() {
  const networkData = {
    nodes: [
      {
        id: "vaswani-2017-1",
        name: "Vaswani, 2017",
        group: 1,
        tooltip: formatTooltip({
          title: "Attention is All you Need",
          year: "2017",
          authors:
            "Ashish Vaswani, Noam M. Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin",
        }),
      },
      {
        id: "raffel-2019-1",
        name: "Raffel, 2019",
        group: 1,
        tooltip: formatTooltip({
          title:
            "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer",
          year: "2019",
          authors:
            "Colin Raffel, Noam M. Shazeer, Adam Roberts, Katherine Lee, Sharan Narang, Michael Matena, Yanqi Zhou, Wei Li, Peter J. Liu",
        }),
      },
      {
        id: "radford-2021-1",
        name: "Radford, 2021",
        group: 2,
        tooltip: formatTooltip({
          title:
            "Learning Transferable Visual Models From Natural Language Supervision",
          year: "2021",
          authors:
            "Alec Radford, Jong Wook Kim, Chris Hallacy, A. Ramesh, Gabriel Goh, Sandhini Agarwal, Girish Sastry, Amanda Askell, Pamela Mishkin, Jack Clark, Gretchen Krueger, I. Sutskever",
        }),
      },
    ],
    links: [
      { source: "raffel-2019-1", target: "vaswani-2017-1", value: 1.0 },
      { source: "radford-2021-1", target: "vaswani-2017-1", value: 0.5 },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Network Chart</title>
      </Helmet>
      <NetworkChart
        nodes={networkData.nodes}
        links={networkData.links}
        height={800}
      />
    </>
  );
}
