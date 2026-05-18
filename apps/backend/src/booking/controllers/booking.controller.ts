import { Body, Controller, Post } from "@nestjs/common";
import { CreateBookingDto } from "@repo/api";

import { BookingService } from "../services/booking.service";

@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  createBooking(@Body() body: CreateBookingDto) {
    return this.bookingService.createBooking(body);
  }
}
