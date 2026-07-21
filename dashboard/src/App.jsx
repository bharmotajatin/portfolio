import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Header from './components/Header';
import KPICards from './components/KPICards';
import MetricCards from './components/MetricCards';
import {
  TopAirlinesBarChart,
  ScheduledFlightsLineChart,
  DelayStatusPieChart,
  ServiceRatingBarChart,
} from './components/ChartsSection';
import FlightDataTable from './components/FlightDataTable';
import ThreeScene from './components/ThreeScene';
import {
  getFlightTableRows,
  getKpiMetrics,
  getTopAirlinesForChart,
  getDelayStatusData,
  getScheduledFlightsByDate,
  getDelayFlightsBreakdown,
  getServiceRatingData,
} from './data/flightData';
import './App.css';

const DEFAULT_DATE_RANGE = 'Feb 24 - Mar 3, 2026';

export default function App() {
  const [dateRange] = useState(DEFAULT_DATE_RANGE);
  const [scheduledActive, setScheduledActive] = useState(true);

  const rows = useMemo(() => getFlightTableRows(), []);
  const kpiMetrics = useMemo(() => getKpiMetrics(rows), [rows]);
  const topAirlines = useMemo(() => getTopAirlinesForChart(rows), [rows]);
  const delayStatusData = useMemo(() => getDelayStatusData(rows), [rows]);
  const scheduledByDate = useMemo(() => getScheduledFlightsByDate(), []);
  const delayBreakdown = useMemo(() => getDelayFlightsBreakdown(rows), [rows]);
  const serviceRatingData = useMemo(() => getServiceRatingData(), []);

  const handleExport = () => {
    window.alert('Export would download the current dashboard data.');
  };

  return (
    <div className="app">
      {/* Three.js background */}
      <div className="three-background" aria-hidden>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.6} />
          <ThreeScene />
        </Canvas>
      </div>

      <div className="app-content">
        <Header dateRange={dateRange} onExport={handleExport} />

        <main className="dashboard-main">
          <motion.section
            className="dashboard-hero"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="dashboard-title">Scheduled Flight Dashboard</h1>
            <p className="dashboard-subtitle">
              Monitor regular flight operations and performance metrics.
            </p>
            <div className="filter-tabs" role="group" aria-label="Flight type filter">
              <button
                type="button"
                className={`filter-tab ${scheduledActive ? 'active' : ''}`}
                onClick={() => setScheduledActive(true)}
                aria-pressed={scheduledActive}
                aria-label="View scheduled flights"
              >
                Scheduled {rows.find((r) => r.airline === 'COMBINED')?.total ?? 0}
              </button>
              <button
                type="button"
                className={`filter-tab ${!scheduledActive ? 'active' : ''}`}
                onClick={() => setScheduledActive(false)}
                aria-pressed={!scheduledActive}
                aria-label="View non-scheduled flights"
              >
                Non-Scheduled 31
              </button>
            </div>
            <p className="hero-helper" role="status">
              Scheduled: regular operations · Non-Scheduled: ad hoc / charter
            </p>
          </motion.section>

          <KPICards metrics={kpiMetrics} />

          <MetricCards
            topAirlines={topAirlines}
            delayBreakdown={delayBreakdown}
            totalFlights={kpiMetrics.totalFlights}
          />

          <section className="charts-grid">
            <TopAirlinesBarChart data={topAirlines} />
            <ScheduledFlightsLineChart data={scheduledByDate} />
            <DelayStatusPieChart data={delayStatusData} />
            <ServiceRatingBarChart data={serviceRatingData} />
          </section>

          <FlightDataTable rows={rows} />
        </main>
      </div>
    </div>
  );
}
