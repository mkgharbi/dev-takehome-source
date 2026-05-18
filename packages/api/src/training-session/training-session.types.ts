export const TrainingSessionStatus = {
  Pending: "pending",
  Confirmed: "confirmed",
  Cancelled: "cancelled",
} as const;

export type TrainingSessionStatus =
  (typeof TrainingSessionStatus)[keyof typeof TrainingSessionStatus];

export const TrainingSector = {
  Safety: "safety",
  Hygiene: "hygiene",
  Management: "management",
} as const;

export type TrainingSector =
  (typeof TrainingSector)[keyof typeof TrainingSector];
