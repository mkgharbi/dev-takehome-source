import { Module } from "@nestjs/common";

import { TrainingSessionModule } from "../training-session/training-session.module";
import { BookingController } from "./controllers/booking.controller";
import { BookingRepository } from "./repositories/booking.repository";
import { BookingService } from "./services/booking.service";

@Module({
  imports: [TrainingSessionModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
})
export class BookingModule {}
