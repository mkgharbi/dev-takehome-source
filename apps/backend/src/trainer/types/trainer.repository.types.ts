import { TrainerEntity } from "../entities/trainer.entity";

export type BaseTrainer = Pick<
  TrainerEntity,
  "id" | "firstName" | "lastName" | "email" | "certifications"
>;

export type TrainerForList = BaseTrainer & {
  sessionCount: number;
};
