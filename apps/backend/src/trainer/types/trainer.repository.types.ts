import { TrainerEntity } from "../entities/trainer.entity";

export type BaseTrainer = Pick<
  TrainerEntity,
  "id" | "firstName" | "lastName" | "email" | "certifications"
>;

export type TrainerForList = BaseTrainer & {
  sessionCount: number;
};

export type TrainerRevenue = {
  confirmedRevenueCents: number;
  pendingRevenueCents: number;
  cancelledRevenueCents: number;
  totalRevenueCents: number;
  monthTotalRevenueCents: number;
  monthConfirmedRevenueCents: number;
  monthPendingRevenueCents: number;
  monthCancelledRevenueCents: number;
};
