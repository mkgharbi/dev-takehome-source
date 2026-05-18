import type { TrainingSessionDto } from "@repo/api";
import { formatFullName } from "@repo/utils";

import type { TrainingSessionForList } from "../types/training-session.repository.types";

export const mapTrainingSessionToDto = (
  session: TrainingSessionForList,
): TrainingSessionDto => ({
  id: session.id,
  title: session.title,
  sector: session.sector,
  status: session.status,
  startsAt: session.startsAt.toISOString(),
  endsAt: session.endsAt.toISOString(),
  location: session.location,
  priceCents: session.priceCents,
  capacity: session.capacity,
  trainerId: session.trainerId,
  trainerName: formatFullName({
    firstName: session.trainer.firstName,
    lastName: session.trainer.lastName,
  }),
  bookingCount: session.bookingCount,
});
