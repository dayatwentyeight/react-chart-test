import * as d3 from "d3";
import { useEffect, useRef } from "react";
import styles from "./NetworkChart.module.css";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  group: number;
  tooltip?: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node; // node id or actual Node
  target: string | Node;
  value: number;
}

interface NetworkProps {
  nodes: Node[];
  links: Link[];
  width?: number | string;
  height?: number | string;
  colorScale?: string[];
  linkColor?: string;
  labelOption?: {
    fontColor?: string;
    fontSize?: string;
    dy?: number;
  };
  nodeRadiuses?: number[];
  minMaxScale?: [number, number];
  valueRange?: [number, number];
}

const NetworkChart = ({
  nodes,
  links,
  width = "100%",
  height = "100%",
  colorScale = Array.from(d3.schemePastel2),
  linkColor = "rgba(0, 0, 0, 0.3)",
  labelOption = {
    fontColor: "#1f2937",
    fontSize: "12px",
    dy: -15,
  },
  nodeRadiuses = [50, 40, 30, 20, 10],
  minMaxScale = [100, 25],
  valueRange = [0, 1],
}: NetworkProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomScaleRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const sliderElement = sliderRef.current;
    const tooltip = d3.select(tooltipRef.current);

    const svg = d3.select(svgElement);
    const sliderInput = d3.select(sliderElement).select("input");
    const zoomScale = d3.select(zoomScaleRef.current);

    const { width: svgWidth, height: svgHeight } =
      svgElement.getBoundingClientRect();

    svg.selectAll("*").remove(); // Clear previous content

    const color = d3.scaleOrdinal(colorScale);

    const zoomGroup = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4]) // Minimum and maximum zoom
      .on("zoom", (event) => {
        const { x, y, k: currentScale } = event.transform;

        const scaledWidth = svgWidth * currentScale;
        const scaledHeight = svgHeight * currentScale;

        // Restrict panning with constrainedX & constrainedY
        const constrainedX = Math.max(
          Math.min(x, svgWidth / 2),
          svgWidth / 2 - scaledWidth
        );
        const constrainedY = Math.max(
          Math.min(y, svgHeight / 2),
          svgHeight / 2 - scaledHeight
        );

        zoomGroup.attr(
          "transform",
          `translate(${constrainedX},${constrainedY}) scale(${currentScale})`
        );

        // Control zoom action with slider
        zoomScale.text(currentScale.toFixed(2));
        d3.select(sliderElement)
          .select("input")
          .property("value", currentScale);
      });

    svg.call(zoom);

    const filteredLinks = links.filter(
      (link) => link.value >= valueRange[0] && link.value <= valueRange[1]
    );

    // Calculate minimum, maximum values
    const minLinkValue = d3.min(filteredLinks, (d) => d.value) ?? 0;
    const maxLinkValue = d3.max(filteredLinks, (d) => d.value) ?? 1;

    const linkDistanceScale = d3
      .scaleLinear()
      .domain([minLinkValue, maxLinkValue])
      .range(minMaxScale);

    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        "link",
        d3
          .forceLink(filteredLinks)
          .id((d) => (d as Node).id)
          .distance((d) => linkDistanceScale(d.value)) // Use calculated value
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2))
      .force("collision", d3.forceCollide<Node>().radius(50))
      // Locate nodes at the center even though they're very weakly connected
      .force(
        "radial",
        d3
          .forceRadial(100, svgWidth / 2, svgHeight / 2)
          // Adjust this value over 1 if each node is weakly connected (e.g. no links to other nodes)
          .strength(0.05)
      );

    const link = zoomGroup
      .append("g")
      .attr("stroke", linkColor)
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(filteredLinks)
      .join("line")
      .attr("stroke-width", 1);

    const node = zoomGroup
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll<SVGCircleElement, Node>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => nodeRadiuses[d.group - 1])
      .attr("fill", (d) => color(d.group.toString()))
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on("start", (event, d) => {
            const nodeDatum = d as Node;
            if (!event.active) simulation.alphaTarget(0.3).restart();
            nodeDatum.fx = nodeDatum.x;
            nodeDatum.fy = nodeDatum.y;
          })
          .on("drag", (event, d) => {
            const nodeDatum = d as Node;
            nodeDatum.fx = event.x;
            nodeDatum.fy = event.y;
          })
          .on("end", (event, d) => {
            const nodeDatum = d as Node;
            if (!event.active) simulation.alphaTarget(0);
            nodeDatum.fx = null;
            nodeDatum.fy = null;
          })
      )
      .on("mouseover", function (e, d) {
        // Add tooltip
        const tooltipValue = d.tooltip;
        if (tooltipValue) {
          const nodeX = d.x;
          const nodeY = d.y;

          tooltip
            .style("visibility", "visible")
            .html(`<div>${tooltipValue}</div>`)
            .style("left", `${nodeX!}px`)
            .style("top", `${nodeY!}px`);
        }

        const connectedLinks = filteredLinks.filter(
          (link) =>
            link.source === d.id ||
            (link.source as Node).id === d.id ||
            link.target === d.id ||
            (link.target as Node).id === d.id
        );

        const connectedNodeIds = new Set();
        connectedLinks.forEach((link) => {
          connectedNodeIds.add((link.source as Node).id);
          connectedNodeIds.add((link.target as Node).id);
        });

        // Links of connected nodes
        link.attr("stroke-opacity", (l) =>
          connectedLinks.includes(l) ? 1 : 0.3
        );

        // Connected nodes
        d3.selectAll("circle").attr("opacity", (node) =>
          connectedNodeIds.has((node as Node).id) ? 1 : 0.3
        );

        // Label of connected nodes
        d3.selectAll("text").attr("opacity", (node) =>
          connectedNodeIds.has((node as Node)?.id) ? 1 : 0.3
        );

        // Selected node
        d3.select(this).attr("opacity", 1);
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");

        // Reset opacity
        link.attr("stroke-opacity", 0.5);
        d3.selectAll("circle").attr("opacity", 1);
        d3.selectAll("text").attr("opacity", 1);
      });

    const label = zoomGroup
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("dy", labelOption.dy!)
      .attr("text-anchor", "middle")
      .text((d) => d.name)
      .style("font-size", labelOption.fontSize!)
      .style("fill", labelOption.fontColor!);

    // Update nodes, links, labels on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

      label.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
    });

    sliderInput.on("input", function (event) {
      const inputElement = event.target as HTMLInputElement;
      const zoomValue = +inputElement.value;
      svg.transition().call(zoom.scaleTo, zoomValue);
    });

    return () => {
      simulation.stop();
    };
  }, [
    nodes,
    links,
    width,
    height,
    colorScale,
    linkColor,
    labelOption.fontSize,
    labelOption.fontColor,
    labelOption.dy,
    nodeRadiuses,
    minMaxScale,
    valueRange,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <svg ref={svgRef} width={width} height={height}></svg>
      </div>
      <div ref={tooltipRef} className={styles.tooltip}></div>
      <div className={styles.sliderWrapper}>
        <div ref={sliderRef} className={styles.slider}>
          <div className={styles.zoomText}>
            <span>Zoom: </span>
            <span ref={zoomScaleRef}>1.00</span>x
          </div>
          <input type="range" min="0.5" max="4" step="0.01" defaultValue="1" />
        </div>
      </div>
    </div>
  );
};

export default NetworkChart;
