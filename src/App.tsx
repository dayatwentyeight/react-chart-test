import { Link } from "react-router-dom";

function App() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/rechart-vs-chartjs">Rechart vs Chart.js</Link>
        </li>
        <li>
          <Link to="/network-chart">Network Chart</Link>
        </li>
      </ul>
    </nav>
  );
}

export default App;
