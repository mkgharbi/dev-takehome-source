import { Column, Entity, OneToMany } from "typeorm";

import { TrainingSessionEntity } from "../../training-session/entities/training-session.entity";
import { BaseEntity } from "../../utils/helpers/base-entity";

@Entity("trainer")
export class TrainerEntity extends BaseEntity {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: "simple-json", default: "[]" })
  certifications!: string[];

  @OneToMany(() => TrainingSessionEntity, (session) => session.trainer)
  sessions!: TrainingSessionEntity[];
}
