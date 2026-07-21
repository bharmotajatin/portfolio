import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLIGHT_TABLE_COLUMNS } from '../data/flightData';

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.3 },
  }),
};

function getCellValue(row, colId) {
  if (colId === 'airline') return row.airline;
  const v = row[colId];
  return v === undefined || v === null ? '–' : Number(v);
}

export default function FlightDataTable({ rows }) {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [filter, setFilter] = useState('all'); // all | combined | airlines

  const filteredRows = useMemo(() => {
    if (filter === 'combined') return rows.filter((r) => r.airline === 'COMBINED');
    if (filter === 'airlines') return rows.filter((r) => r.airline !== 'COMBINED');
    return rows;
  }, [rows, filter]);

  return (
    <motion.div
      className="table-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="table-section__header">
        <div>
          <h2 className="table-section__title">Flight Category and Airline Performance</h2>
          <p className="table-section__intro">
            Performance by flight category and airline. Filter to Combined totals or per-airline breakdown.
          </p>
        </div>
        <div className="table-section__filters">
          <button
            type="button"
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'combined' ? 'active' : ''}`}
            onClick={() => setFilter('combined')}
          >
            Combined
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'airlines' ? 'active' : ''}`}
            onClick={() => setFilter('airlines')}
          >
            By Airline
          </button>
        </div>
      </div>
      <div
        className="table-wrapper"
        onScroll={(e) => setScrollLeft(e.target.scrollLeft)}
      >
        <table className="flight-table">
          <thead>
            <tr>
              {FLIGHT_TABLE_COLUMNS.map((col) => (
                <th
                  key={col.id}
                  style={{
                    minWidth: col.width || '90px',
                    backgroundColor: col.color || 'var(--neo-yellow)',
                  }}
                  className={col.bold ? 'th-total' : ''}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredRows.map((row, rowIndex) => (
                <motion.tr
                  key={row.airline}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  custom={rowIndex}
                  className={row.airline === 'COMBINED' ? 'row-combined' : ''}
                >
                  {FLIGHT_TABLE_COLUMNS.map((col) => (
                    <td
                      key={col.id}
                      style={
                        col.id !== 'airline' && col.color
                          ? { borderLeftColor: col.color }
                          : undefined
                      }
                      className={col.bold ? 'td-total' : ''}
                    >
                      {getCellValue(row, col.id)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
