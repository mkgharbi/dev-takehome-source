import { BookingStatus } from "@repo/api/constants";
import { Column, Entity, Index, ManyToOne, Unique } from "typeorm";

import { TrainingSessionEntity } from "../../training-session/entities/training-session.entity";
import { BaseEntity } from "../../utils/helpers/base-entity";

@Entity("booking")
@Unique(["sessionId", "attendeeEmail"])
export class BookingEntity extends BaseEntity {
  @ManyToOne(() => TrainingSessionEntity, (session) => session.bookings, {
    nullable: false,
    onDelete: "CASCADE",
  })
  session!: TrainingSessionEntity;

  @Index()
  @Column()
  sessionId!: string;

  @Column()
  attendeeName!: string;

  @Column()
  attendeeEmail!: string;

  @Index()
  @Column({ type: "varchar", default: BookingStatus.Pending })
  status!: BookingStatus;
}
