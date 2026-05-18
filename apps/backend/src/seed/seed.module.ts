import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SeedService } from "./services/seed.service";
import { BookingEntity } from "../booking/entities/booking.entity";
import { TrainerEntity } from "../trainer/entities/trainer.entity";
import { TrainingSessionEntity } from "../training-session/entities/training-session.entity";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainerEntity,
      TrainingSessionEntity,
      BookingEntity,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
