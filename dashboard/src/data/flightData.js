/**
 * Flight performance data by category and airline (based on second image parameters).
 * Columns: Cancelled, Arrived Later Than STA, Departed On/Before STD, Within SGT, etc.
 */
export const FLIGHT_TABLE_COLUMNS = [
  { id: 'airline', label: 'FLIGHT CATEGORY AND AIRLINE', width: '180px' },
  { id: 'cancelled', label: 'Cancelled Flight', color: '#ef4444' },
  { id: 'arrivedLaterSTA', label: 'Flight Arrived Later Than STA', color: '#ec4899' },
  { id: 'departedOnOrBeforeSTD', label: 'And Departed On Or Before STD', color: '#22c55e' },
  { id: 'departedWithinSGT', label: 'And Departed Within The SGT', color: '#22c55e' },
  { id: 'gtMoreThanSGT_NotGHA', label: 'And Departed With GT More Than SGT (Not Attributable to GHA)', color: '#84cc16' },
  { id: 'gtMoreThanSGT_GHA', label: 'And Departed With GT More Than SGT (Attributable to GHA)', color: '#eab308' },
  { id: 'arrivedOnOrBeforeSTA', label: 'Flights Arrived On Or Before STA', color: '#22c55e' },
  { id: 'onTimeFlights', label: 'On Time Flights', color: '#eab308' },
  { id: 'arrivedBeforeSTA', label: 'Flights Arrived Before STA', color: '#22c55e' },
  { id: 'departedWithLessSGT', label: 'And Departed With Less SGT', color: '#22c55e' },
  { id: 'departedWithinSGT2', label: 'And Departed Within SGT', color: '#22c55e' },
  { id: 'exceedingSGT_BeforeSTD', label: 'Exceeding SGT But Before STD', color: '#84cc16' },
  { id: 'exceedingSGT_AfterSTD_NotGHA', label: 'Exceeding SGT But After STD (Not Attributable to GHA)', color: '#eab308' },
  { id: 'exceedingSGT_AfterSTD_GHA', label: 'Exceeding SGT But After STD (Attributable to GHA)', color: '#f97316' },
  { id: 'total', label: 'TOTAL', color: '#eab308', bold: true },
];

/** Single row: airline + all metric counts */
export function getFlightTableRows() {
  return [
    {
      airline: 'COMBINED',
      cancelled: 44,
      arrivedLaterSTA: 120,
      departedOnOrBeforeSTD: 85,
      departedWithinSGT: 90,
      gtMoreThanSGT_NotGHA: 18,
      gtMoreThanSGT_GHA: 12,
      arrivedOnOrBeforeSTA: 1130,
      onTimeFlights: 1050,
      arrivedBeforeSTA: 200,
      departedWithLessSGT: 180,
      departedWithinSGT2: 800,
      exceedingSGT_BeforeSTD: 50,
      exceedingSGT_AfterSTD_NotGHA: 40,
      exceedingSGT_AfterSTD_GHA: 30,
      total: 1294,
    },
    {
      airline: 'Aerologic Cargo',
      cancelled: 2,
      arrivedLaterSTA: 5,
      departedOnOrBeforeSTD: 3,
      departedWithinSGT: 4,
      gtMoreThanSGT_NotGHA: 1,
      gtMoreThanSGT_GHA: 0,
      arrivedOnOrBeforeSTA: 45,
      onTimeFlights: 42,
      arrivedBeforeSTA: 8,
      departedWithLessSGT: 6,
      departedWithinSGT2: 35,
      exceedingSGT_BeforeSTD: 2,
      exceedingSGT_AfterSTD_NotGHA: 2,
      exceedingSGT_AfterSTD_GHA: 1,
      total: 52,
    },
    {
      airline: 'Air Arabia',
      cancelled: 3,
      arrivedLaterSTA: 8,
      departedOnOrBeforeSTD: 6,
      departedWithinSGT: 7,
      gtMoreThanSGT_NotGHA: 1,
      gtMoreThanSGT_GHA: 1,
      arrivedOnOrBeforeSTA: 62,
      onTimeFlights: 58,
      arrivedBeforeSTA: 12,
      departedWithLessSGT: 10,
      departedWithinSGT2: 48,
      exceedingSGT_BeforeSTD: 4,
      exceedingSGT_AfterSTD_NotGHA: 3,
      exceedingSGT_AfterSTD_GHA: 2,
      total: 73,
    },
    {
      airline: 'Akasa Air',
      cancelled: 5,
      arrivedLaterSTA: 15,
      departedOnOrBeforeSTD: 12,
      departedWithinSGT: 14,
      gtMoreThanSGT_NotGHA: 2,
      gtMoreThanSGT_GHA: 1,
      arrivedOnOrBeforeSTA: 210,
      onTimeFlights: 195,
      arrivedBeforeSTA: 45,
      departedWithLessSGT: 38,
      departedWithinSGT2: 165,
      exceedingSGT_BeforeSTD: 12,
      exceedingSGT_AfterSTD_NotGHA: 8,
      exceedingSGT_AfterSTD_GHA: 5,
      total: 230,
    },
    {
      airline: 'SpiceJet',
      cancelled: 8,
      arrivedLaterSTA: 22,
      departedOnOrBeforeSTD: 18,
      departedWithinSGT: 20,
      gtMoreThanSGT_NotGHA: 4,
      gtMoreThanSGT_GHA: 3,
      arrivedOnOrBeforeSTA: 185,
      onTimeFlights: 168,
      arrivedBeforeSTA: 38,
      departedWithLessSGT: 32,
      departedWithinSGT2: 148,
      exceedingSGT_BeforeSTD: 10,
      exceedingSGT_AfterSTD_NotGHA: 9,
      exceedingSGT_AfterSTD_GHA: 6,
      total: 215,
    },
    {
      airline: 'Air India Express',
      cancelled: 6,
      arrivedLaterSTA: 18,
      departedOnOrBeforeSTD: 14,
      departedWithinSGT: 16,
      gtMoreThanSGT_NotGHA: 3,
      gtMoreThanSGT_GHA: 2,
      arrivedOnOrBeforeSTA: 412,
      onTimeFlights: 388,
      arrivedBeforeSTA: 52,
      departedWithLessSGT: 48,
      departedWithinSGT2: 358,
      exceedingSGT_BeforeSTD: 14,
      exceedingSGT_AfterSTD_NotGHA: 10,
      exceedingSGT_AfterSTD_GHA: 6,
      total: 436,
    },
    {
      airline: 'Gulf Air',
      cancelled: 4,
      arrivedLaterSTA: 10,
      departedOnOrBeforeSTD: 8,
      departedWithinSGT: 9,
      gtMoreThanSGT_NotGHA: 2,
      gtMoreThanSGT_GHA: 1,
      arrivedOnOrBeforeSTA: 98,
      onTimeFlights: 90,
      arrivedBeforeSTA: 18,
      departedWithLessSGT: 16,
      departedWithinSGT2: 78,
      exceedingSGT_BeforeSTD: 5,
      exceedingSGT_AfterSTD_NotGHA: 4,
      exceedingSGT_AfterSTD_GHA: 2,
      total: 112,
    },
    {
      airline: 'IndiGo',
      cancelled: 10,
      arrivedLaterSTA: 28,
      departedOnOrBeforeSTD: 20,
      departedWithinSGT: 22,
      gtMoreThanSGT_NotGHA: 5,
      gtMoreThanSGT_GHA: 4,
      arrivedOnOrBeforeSTA: 138,
      onTimeFlights: 123,
      arrivedBeforeSTA: 27,
      departedWithLessSGT: 24,
      departedWithinSGT2: 108,
      exceedingSGT_BeforeSTD: 3,
      exceedingSGT_AfterSTD_NotGHA: 4,
      exceedingSGT_AfterSTD_GHA: 3,
      total: 176,
    },
  ];
}

/** Aggregates for dashboard KPIs (from COMBINED row) */
export function getKpiMetrics(rows) {
  const combined = rows.find((r) => r.airline === 'COMBINED') || rows[0];
  const total = combined?.total ?? 0;
  const cancelled = combined?.cancelled ?? 0;
  const active = total - cancelled;
  const operationalRate = total ? ((active / total) * 100).toFixed(1) : 0;
  const cancellationRate = total ? ((cancelled / total) * 100).toFixed(1) : 0;
  return {
    totalFlights: total,
    active,
    cancelled,
    operationalRate: Number(operationalRate),
    cancellationRate: Number(cancellationRate),
  };
}

/** Top airlines by flight count (for bar chart) */
export function getTopAirlinesForChart(rows) {
  return rows
    .filter((r) => r.airline !== 'COMBINED')
    .sort((a, b) => (b.total || 0) - (a.total || 0))
    .slice(0, 6)
    .map((r) => ({ name: r.airline.length > 14 ? r.airline.slice(0, 12) + '…' : r.airline, flights: r.total, fullName: r.airline }));
}

/** Delay status: Before Time, On Time, Delayed (derived) */
export function getDelayStatusData(rows) {
  const combined = rows.find((r) => r.airline === 'COMBINED');
  if (!combined) return [{ name: 'Before Time', value: 0 }, { name: 'On Time', value: 0 }, { name: 'Delayed', value: 0 }];
  const onTime = combined.onTimeFlights ?? 0;
  const beforeTime = combined.arrivedBeforeSTA ?? 0;
  const delayed = (combined.arrivedLaterSTA ?? 0) + (combined.exceedingSGT_AfterSTD_GHA ?? 0) + (combined.exceedingSGT_AfterSTD_NotGHA ?? 0);
  return [
    { name: 'Before Time', value: beforeTime, fill: '#22c55e' },
    { name: 'On Time', value: onTime, fill: '#eab308' },
    { name: 'Delayed', value: delayed, fill: '#f97316' },
  ];
}

/** Scheduled flight counts by date (for line chart) */
export function getScheduledFlightsByDate() {
  const start = new Date('2025-12-19');
  const days = 14;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const count = 8 + Math.floor(Math.random() * 18);
    return {
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      flights: count,
    };
  });
}

/** GHA vs Non-GHA delay counts */
export function getDelayFlightsBreakdown(rows) {
  const combined = rows.find((r) => r.airline === 'COMBINED');
  const gha = (combined?.exceedingSGT_AfterSTD_GHA ?? 0) + (combined?.gtMoreThanSGT_GHA ?? 0);
  const nonGha = (combined?.total ?? 0) - (combined?.onTimeFlights ?? 0) - (combined?.arrivedBeforeSTA ?? 0) - gha;
  return { gha, nonGha };
}

/** Service rating distribution for chart */
export function getServiceRatingData(rows, isScheduled = true) {
  const total = rows?.find((r) => r.airline === 'COMBINED')?.total ?? 1294;
  const scale = isScheduled ? 1 : total / 1294;
  return [
    { name: 'Satisfactory', count: Math.round(1100 * scale), fill: '#22c55e' },
    { name: 'No Rating', count: Math.round(120 * scale), fill: '#eab308' },
    { name: 'Excellent', count: Math.round(45 * scale), fill: '#22c55e' },
    { name: 'Not satisfactory', count: Math.round(19 * scale), fill: '#ef4444' },
    { name: 'Good', count: Math.round(10 * scale), fill: '#22c55e' },
  ];
}

/** Non-scheduled rows (smaller set for scenario) */
export function getNonScheduledRows() {
  const scheduled = getFlightTableRows();
  const combined = scheduled.find((r) => r.airline === 'COMBINED');
  return [
    {
      ...combined,
      airline: 'COMBINED',
      total: 31,
      cancelled: 2,
      arrivedLaterSTA: 4,
      departedOnOrBeforeSTD: 3,
      departedWithinSGT: 4,
      gtMoreThanSGT_NotGHA: 1,
      gtMoreThanSGT_GHA: 1,
      arrivedOnOrBeforeSTA: 26,
      onTimeFlights: 24,
      arrivedBeforeSTA: 5,
      departedWithLessSGT: 4,
      departedWithinSGT2: 20,
      exceedingSGT_BeforeSTD: 2,
      exceedingSGT_AfterSTD_NotGHA: 2,
      exceedingSGT_AfterSTD_GHA: 1,
    },
    ...scheduled.filter((r) => r.airline !== 'COMBINED').slice(0, 3).map((r) => ({
      ...r,
      total: Math.max(1, Math.round(r.total * 0.08)),
      cancelled: Math.min(1, r.cancelled),
      onTimeFlights: Math.max(0, Math.round(r.total * 0.08) - 1),
    })),
  ];
}

/** GHA vs Non-GHA delay comparison for bar chart */
export function getGhaVsNonGhaChartData(rows) {
  const breakdown = getDelayFlightsBreakdown(rows);
  return [
    { name: 'GHA', count: breakdown.gha, fill: '#eab308' },
    { name: 'Non-GHA', count: breakdown.nonGha, fill: '#f97316' },
  ];
}

/** Flight type distribution: Turnaround vs Ramp Handling */
export function getFlightTypeDistribution(rows) {
  const combined = rows.find((r) => r.airline === 'COMBINED');
  const total = combined?.total ?? 0;
  const turnaround = total ? Math.round(total * 0.96) : 0;
  const ramp = total - turnaround;
  return [
    { name: 'Turnaround', value: turnaround, fill: '#22c55e' },
    { name: 'Ramp Handling', value: ramp, fill: '#f97316' },
  ];
}

/** On-time performance by airline (on-time count or %) */
export function getOnTimeByAirlineData(rows) {
  return rows
    .filter((r) => r.airline !== 'COMBINED')
    .sort((a, b) => (b.onTimeFlights ?? 0) - (a.onTimeFlights ?? 0))
    .slice(0, 6)
    .map((r) => ({
      name: r.airline.length > 12 ? r.airline.slice(0, 10) + '…' : r.airline,
      fullName: r.airline,
      onTime: r.onTimeFlights ?? 0,
      total: r.total ?? 0,
      pct: r.total ? Math.round(((r.onTimeFlights ?? 0) / r.total) * 100) : 0,
    }));
}

/** Active vs Cancelled trend over last 7 days (for area/line) */
export function getActiveVsCancelledTrend(rows, isScheduled = true) {
  const combined = rows.find((r) => r.airline === 'COMBINED');
  const total = combined?.total ?? 1294;
  const cancelled = combined?.cancelled ?? 44;
  const active = total - cancelled;
  const days = 7;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const dayTotal = Math.round((total / days) * (0.9 + Math.random() * 0.2));
    const dayCancelled = i === days - 1 ? Math.round(cancelled * 0.2) : Math.round(dayTotal * 0.03);
    return {
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      date: d.toISOString().slice(0, 10),
      active: dayTotal - dayCancelled,
      cancelled: dayCancelled,
      total: dayTotal,
    };
  });
}
