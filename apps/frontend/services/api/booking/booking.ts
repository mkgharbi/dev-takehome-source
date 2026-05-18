import type { BookingDto, CreateBookingDto } from "@repo/api";
import { ApiRoutes } from "@repo/api/constants";

import { mutateTrainingSessions } from "../training-session/training-session";

import { apiPost } from "@/lib/api-client";


export const createBooking = async (
  input: CreateBookingDto,
): Promise<BookingDto> => {
  const booking = await apiPost<BookingDto>(ApiRoutes.bookings, input);
  await mutateTrainingSessions();
  return booking;
};
