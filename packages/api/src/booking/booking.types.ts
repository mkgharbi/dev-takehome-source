export const BookingStatus = {
  Pending: "pending",
  Confirmed: "confirmed",
  Cancelled: "cancelled",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
