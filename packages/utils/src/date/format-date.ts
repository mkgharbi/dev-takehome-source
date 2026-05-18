/**
 * Returns the ISO date portion (`YYYY-MM-DD`).
 */
export const formatDateISO = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
};

const HUMAN_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/**
 * Returns a French human-readable date (`12 mai 2026`).
 */
export const formatDateHuman = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return HUMAN_FORMATTER.format(d);
};
