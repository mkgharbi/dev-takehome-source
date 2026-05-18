import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { BaseRepository } from "../../utils/helpers/base-repository";
import { BookingEntity } from "../entities/booking.entity";
import {
  BaseBooking,
  BookingAfterCreated,
} from "../types/booking.repository.types";

type BookingCreateInput = {
  sessionId: string;
  attendeeName: string;
  attendeeEmail: string;
};

@Injectable()
export class BookingRepository extends BaseRepository<BookingEntity> {
  constructor(dataSource: DataSource) {
    super(BookingEntity, dataSource);
  }

  async create(input: BookingCreateInput): Promise<BookingAfterCreated> {
    const booking = await this.repository.save(
      this.repository.create(input),
    );
    return {
      id: booking.id,
      sessionId: booking.sessionId,
      attendeeName: booking.attendeeName,
      attendeeEmail: booking.attendeeEmail,
      status: booking.status,
      createdAt: booking.createdAt,
    };
  }

  findByIdOrFail(id: string): Promise<BaseBooking> {
    return this.repository.findOneOrFail({
      where: { id },
      select: [
        "id",
        "sessionId",
        "attendeeName",
        "attendeeEmail",
        "status",
        "createdAt",
      ],
    });
  }
}
