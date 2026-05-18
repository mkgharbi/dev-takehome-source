import { Injectable } from "@nestjs/common";
import type { BookingDto, CreateBookingDto } from "@repo/api";

import { TrainingSessionRepository } from "../../training-session/repositories/training-session.repository";
import { ApiException } from "../../utils/errors/api.exception";
import { ErrorCode } from "../../utils/errors/error-codes";
import { mapBookingToDto } from "../mappers/booking.mapper";
import { BookingRepository } from "../repositories/booking.repository";

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly trainingSessionRepository: TrainingSessionRepository,
  ) {}

  async createBooking(input: CreateBookingDto): Promise<BookingDto> {
    try {
      await this.trainingSessionRepository.findByIdOrFail(input.sessionId);
    } catch {
      ApiException.with(ErrorCode.TrainingSessionNotFound, {
        sessionId: input.sessionId,
      });
    }

    const booking = await this.bookingRepository.create(input);
    return mapBookingToDto(booking);
  }
}
