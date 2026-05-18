import { BookingEntity } from "../entities/booking.entity";

export type BaseBooking = Pick<
  BookingEntity,
  | "id"
  | "sessionId"
  | "attendeeName"
  | "attendeeEmail"
  | "status"
  | "createdAt"
>;

export type BookingAfterCreated = BaseBooking;
