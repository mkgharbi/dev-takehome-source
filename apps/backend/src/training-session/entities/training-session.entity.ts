import {
  TrainingSector,
  TrainingSessionStatus,
} from "@repo/api/constants";
import {
  Check,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { BookingEntity } from "../../booking/entities/booking.entity";
import { TrainerEntity } from "../../trainer/entities/trainer.entity";
import { BaseEntity } from "../../utils/helpers/base-entity";

@Entity("training_session")
@Check(`"endsAt" > "startsAt"`)
@Check(`"priceCents" >= 0`)
@Check(`"capacity" > 0`)
export class TrainingSessionEntity extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: "varchar" })
  sector!: TrainingSector;

  @Index()
  @Column({ type: "varchar", default: TrainingSessionStatus.Pending })
  status!: TrainingSessionStatus;

  @Index()
  @Column({ type: "datetime" })
  startsAt!: Date;

  @Column({ type: "datetime" })
  endsAt!: Date;

  @Column()
  location!: string;

  @Column({ type: "integer" })
  priceCents!: number;

  @Column({ type: "integer" })
  capacity!: number;

  @ManyToOne(() => TrainerEntity, (trainer) => trainer.sessions, {
    nullable: false,
    onDelete: "CASCADE",
  })
  trainer!: TrainerEntity;

  @Index()
  @Column()
  trainerId!: string;

  @OneToMany(() => BookingEntity, (booking) => booking.session)
  bookings!: BookingEntity[];
}
