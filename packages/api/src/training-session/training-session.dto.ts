import type {
  TrainingSector,
  TrainingSessionStatus,
} from "./training-session.types";

export type TrainingSessionDto = {
  id: string;
  title: string;
  sector: TrainingSector;
  status: TrainingSessionStatus;
  startsAt: string;
  endsAt: string;
  location: string;
  priceCents: number;
  capacity: number;
  trainerId: string;
  trainerName: string;
  bookingCount: number;
};
