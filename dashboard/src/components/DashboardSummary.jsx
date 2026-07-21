import { motion } from 'framer-motion';

export default function DashboardSummary({ scenario, dateRange, airlineFilter }) {
  return (
    <motion.div
      className="dashboard-summary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-live="polite"
    >
      <span className="dashboard-summary__label">Viewing:</span>
      <span className="dashboard-summary__value">
        {scenario === 'scheduled' ? 'Scheduled' : 'Non-Scheduled'} flights
      </span>
      <span className="dashboard-summary__sep">·</span>
      <span className="dashboard-summary__value">{dateRange}</span>
      {airlineFilter && (
        <>
          <span className="dashboard-summary__sep">·</span>
          <span className="dashboard-summary__value">Airline: {airlineFilter}</span>
        </>
      )}
    </motion.div>
  );
}
