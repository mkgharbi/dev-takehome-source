import type { BookingStatus } from "./booking.types";

export type BookingDto = {
  id: string;
  sessionId: string;
  attendeeName: string;
  attendeeEmail: string;
  status: BookingStatus;
  createdAt: string;
};
