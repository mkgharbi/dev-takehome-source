const EUR_FORMATTER = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

/**
 * Formats a price stored as integer cents (e.g. 19900) to a EUR string ("199,00 €").
 */
export const formatEur = (cents: number): string =>
  EUR_FORMATTER.format(cents / 100);
