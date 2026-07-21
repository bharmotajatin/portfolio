import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const COLORS = ['#22c55e', '#eab308', '#3b82f6', '#f97316', '#ec4899', '#8b5cf6'];

export function TopAirlinesBarChart({ data }) {
  const total = data.reduce((s, d) => s + (d.flights || 0), 0);
  return (
    <motion.div
      className="chart-card"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      custom={0}
    >
      <h3 className="chart-card__title">Top Airlines by Flight Count</h3>
      <p className="chart-card__desc">Distribution of flights by carrier.</p>
      <div className="chart-card__meta">
        {data.length} data points · Total: {total.toLocaleString()}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value) => [value?.toLocaleString(), 'Flights']}
            labelFormatter={(label) => data.find((d) => d.name === label)?.fullName || label}
          />
          <Bar dataKey="flights" fill="#22c55e" radius={[0, 4, 4, 0]} name="Flights" isAnimationActive animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function ScheduledFlightsLineChart({ data }) {
  const total = data.reduce((s, d) => s + (d.flights || 0), 0);
  return (
    <motion.div
      className="chart-card"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      custom={1}
    >
      <h3 className="chart-card__title">Scheduled Flight Dates</h3>
      <p className="chart-card__desc">Daily scheduled flight volume over the period.</p>
      <div className="chart-card__meta">
        {data.length} data points · Total: {total.toLocaleString()}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="flightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => [value, 'Flights']} />
          <Area
            type="monotone"
            dataKey="flights"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#flightGradient)"
            isAnimationActive
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function DelayStatusPieChart({ data }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  return (
    <motion.div
      className="chart-card"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      custom={2}
    >
      <h3 className="chart-card__title">Scheduled Flight Delay Status</h3>
      <p className="chart-card__desc">Before time, on time, and delayed proportions.</p>
      <div className="chart-card__meta">
        {data.length} data points · Total: {total.toLocaleString()}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            isAnimationActive
            animationDuration={800}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={data[i].fill || COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value?.toLocaleString(), 'Flights']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function ServiceRatingBarChart({ data }) {
  const total = data.reduce((s, d) => s + (d.count || 0), 0);
  return (
    <motion.div
      className="chart-card"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      custom={3}
    >
      <h3 className="chart-card__title">Scheduled Service Rating Distribution</h3>
      <p className="chart-card__desc">Customer service ratings for scheduled flights.</p>
      <div className="chart-card__meta">
        {data.length} data points · Total: {total.toLocaleString()}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => [value?.toLocaleString(), 'Count']} />
          <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} name="Count" isAnimationActive animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* —— GHA vs Non-GHA delay comparison —— */
export function GhaVsNonGhaChart({ data }) {
  const total = data.reduce((s, d) => s + (d.count || 0), 0);
  return (
    <motion.div
      className="chart-card"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      custom={4}
    >
      <h3 className="chart-card__title">Delay Flights: GHA vs Non-GHA</h3>
      <p className="chart-card__desc">Delays attributable to GHA vs other reasons.</p>
      <div className="chart-card__meta">
        {data.length} data points · Total delays: {total.toLocaleString()}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => [value?.toLocaleString(), 'Flights']} />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            name="Delayed"
            isAnimationActive
            animationDuration={800}
            fill={(entry) => entry.fill || '#eab308'}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill || COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* —— Flight type distribution (Turnaround / Ramp) —— */
export function FlightTypeChart({ data }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  return (
    <motion.div
      className="chart-card"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      custom={5}
    >
      <h3 className="chart-card__title">Flight Type Distribution</h3>
      <p className="chart-card__desc">Turnaround vs Ramp Handling share.</p>
      <div className="chart-card__meta">
        {data.length} data points · Total: {total.toLocaleString()}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            isAnimationActive
            animationDuration={800}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={data[i].fill || COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value?.toLocaleString(), 'Flights']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* —— On-time performance by airline —— */
export function OnTimeByAirlineChart({ data }) {
  const total = data.reduce((s, d) => s + (d.onTime || 0), 0);
  return (
    <motion.div
      className="chart-card"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      custom={6}
    >
      <h3 className="chart-card__title">On-Time Performance by Airline</h3>
      <p className="chart-card__desc">On-time flight count per carrier.</p>
      <div className="chart-card__meta">
        {data.length} airlines · Total on-time: {total.toLocaleString()}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 72, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={68} tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(value) => [value?.toLocaleString(), 'On-time']}
            labelFormatter={(label) => data.find((d) => d.name === label)?.fullName || label}
          />
          <Bar dataKey="onTime" fill="#22c55e" radius={[0, 4, 4, 0]} name="On-time" isAnimationActive animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* —— Active vs Cancelled trend (last 7 days) —— */
export function ActiveCancelledTrendChart({ data }) {
  const total = data.reduce((s, d) => s + (d.total || 0), 0);
  return (
    <motion.div
      className="chart-card"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      custom={7}
    >
      <h3 className="chart-card__title">Active vs Cancelled Trend</h3>
      <p className="chart-card__desc">Daily active and cancelled flights over the period.</p>
      <div className="chart-card__meta">
        {data.length} days · Total flights: {total.toLocaleString()}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cancelledGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value, name) => [value?.toLocaleString(), name === 'active' ? 'Active' : 'Cancelled']}
            labelFormatter={(label) => label}
          />
          <Legend />
          <Area type="monotone" dataKey="active" stroke="#22c55e" strokeWidth={2} fill="url(#activeGrad)" name="Active" isAnimationActive animationDuration={800} />
          <Area type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} fill="url(#cancelledGrad)" name="Cancelled" isAnimationActive animationDuration={800} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
