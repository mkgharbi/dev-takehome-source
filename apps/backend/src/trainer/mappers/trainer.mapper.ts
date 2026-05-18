import type { TrainerDto } from "@repo/api";

import type { TrainerForList } from "../types/trainer.repository.types";

export const mapTrainerToDto = (trainer: TrainerForList): TrainerDto => ({
  id: trainer.id,
  firstName: trainer.firstName,
  lastName: trainer.lastName,
  email: trainer.email,
  certifications: trainer.certifications,
  sessionCount: trainer.sessionCount,
});
