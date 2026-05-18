import { TrainingSessionEntity } from "../entities/training-session.entity";

export type BaseTrainingSession = Pick<
  TrainingSessionEntity,
  | "id"
  | "title"
  | "sector"
  | "status"
  | "startsAt"
  | "endsAt"
  | "location"
  | "priceCents"
  | "capacity"
  | "trainerId"
>;

export type TrainingSessionForList = BaseTrainingSession & {
  trainer: { firstName: string; lastName: string };
  bookingCount: number;
};
