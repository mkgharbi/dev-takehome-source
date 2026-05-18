import type { BookingDto } from "@repo/api";

import type { BaseBooking } from "../types/booking.repository.types";

export const mapBookingToDto = (booking: BaseBooking): BookingDto => ({
  id: booking.id,
  sessionId: booking.sessionId,
  attendeeName: booking.attendeeName,
  attendeeEmail: booking.attendeeEmail,
  status: booking.status,
  createdAt: booking.createdAt.toISOString(),
});
