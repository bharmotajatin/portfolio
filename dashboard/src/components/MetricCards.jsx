import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

export default function MetricCards({ topAirlines, delayBreakdown, totalFlights = 1294 }) {
  const topTwo = topAirlines.slice(0, 2);
  const cards = [
    {
      title: 'Top Airlines',
      items: topTwo.map((a, idx) => ({
        label: `${a.fullName} ${Math.round((a.flights / totalFlights) * 100)}%`,
        trend: true,
        icon: '✈',
        color: idx === 0 ? 'green' : 'yellow',
      })),
    },
    {
      title: 'Flight Types',
      items: [
        { label: 'Turnaround 96%', trend: true, icon: '✓', color: 'green' },
        { label: 'Ramp Handling 3%', trend: true, icon: '▸', color: 'orange' },
      ],
    },
    {
      title: 'Delay Flights',
      items: [
        { label: `GHA ${delayBreakdown.gha}`, trend: true, icon: '🕐' },
        { label: `Non-GHA ${delayBreakdown.nonGha}`, trend: true, icon: '🕐' },
      ],
    },
  ];

  return (
    <motion.div
      className="metric-cards"
      variants={container}
      initial="hidden"
      animate="show"
      role="region"
      aria-label="Operational metrics"
    >
      {cards.map((card) => (
        <motion.div key={card.title} className="metric-card" variants={item}>
          <h3 className="metric-card__title">{card.title}</h3>
          <ul className="metric-card__list">
            {card.items.map((line, i) => (
              <li key={i} className={`metric-card__item ${line.color ? `metric-card__item--${line.color}` : ''}`}>
                <span className="metric-card__icon" aria-hidden>{line.icon}</span>
                <span>{line.label}</span>
                {line.trend && <span className="trend-badge">(trending)</span>}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}
