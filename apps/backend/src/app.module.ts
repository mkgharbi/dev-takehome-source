import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BookingModule } from "./booking/booking.module";
import { BookingEntity } from "./booking/entities/booking.entity";
import { SeedModule } from "./seed/seed.module";
import { TrainerEntity } from "./trainer/entities/trainer.entity";
import { TrainerModule } from "./trainer/trainer.module";
import { TrainingSessionEntity } from "./training-session/entities/training-session.entity";
import { TrainingSessionModule } from "./training-session/training-session.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "better-sqlite3",
      database: "data/takehome.sqlite",
      entities: [TrainerEntity, TrainingSessionEntity, BookingEntity],
      synchronize: true,
      logging: false,
    }),
    TrainerModule,
    TrainingSessionModule,
    BookingModule,
    SeedModule,
  ],
})
export class AppModule {}
