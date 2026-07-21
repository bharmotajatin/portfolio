import { motion } from 'framer-motion';

function AnimatedNumber({ value, suffix = '' }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {typeof value === 'number' ? value.toLocaleString() : value}
      {suffix}
    </motion.span>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function KPICards({ metrics }) {
  const cards = [
    {
      title: 'Total Flights',
      value: metrics.totalFlights,
      trend: '+2.5% from last period',
      icon: '✈',
      iconLabel: 'Flights',
      color: 'green',
    },
    {
      title: 'Active',
      value: metrics.active,
      trend: '+1.8% from last period',
      icon: '✓',
      iconLabel: 'Active',
      color: 'yellow',
    },
    {
      title: 'Cancelled',
      value: metrics.cancelled,
      trend: '-0.5% from last period',
      icon: '✕',
      iconLabel: 'Cancelled',
      color: 'orange',
      iconCross: true,
    },
    {
      title: 'Status Overview',
      lines: [
        { label: `Operational Rate ${metrics.operationalRate}%`, trend: true, ok: true },
        { label: `Cancellation Rate ${metrics.cancellationRate}%`, trend: true, ok: false },
      ],
      color: 'white',
    },
  ];

  return (
    <motion.div
      className="kpi-grid"
      variants={container}
      initial="hidden"
      animate="show"
      role="region"
      aria-label="Key performance indicators"
    >
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          className={`kpi-card kpi-card--${card.color}`}
          variants={item}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          role="article"
          aria-label={card.value !== undefined ? `${card.title}: ${card.value}` : card.title}
        >
          {card.value !== undefined ? (
            <>
              <div className={`kpi-card__icon ${card.iconCross ? 'kpi-card__icon--cross' : ''}`} aria-hidden>
                {card.icon}
              </div>
              <div className="kpi-card__value">
                <AnimatedNumber value={card.value} />
              </div>
              <div className="kpi-card__title">{card.title}</div>
              <div className="kpi-card__trend" title="Compared to previous period">{card.trend}</div>
            </>
          ) : (
            <>
              <div className="kpi-card__title kpi-card__title--block">{card.title}</div>
              {card.lines?.map((line) => (
                <div key={line.label} className="kpi-card__line">
                  <span className={line.ok ? 'text-green' : 'text-orange'}>
                    {line.ok ? '✓' : '✕'} {line.label}
                  </span>
                  {line.trend && <span className="kpi-card__trend-inline">(trending)</span>}
                </div>
              ))}
            </>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
