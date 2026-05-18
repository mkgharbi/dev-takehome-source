import { HttpStatus } from "@nestjs/common";

import { ErrorCode } from "./error-codes";

type ErrorDefinition = {
  status: HttpStatus;
  message: string;
};

export const errorDefinition: Record<ErrorCode, ErrorDefinition> = {
  [ErrorCode.BadRequest]: {
    status: HttpStatus.BAD_REQUEST,
    message: "Requête invalide",
  },
  [ErrorCode.Unauthorized]: {
    status: HttpStatus.UNAUTHORIZED,
    message: "Non authentifié",
  },
  [ErrorCode.Forbidden]: {
    status: HttpStatus.FORBIDDEN,
    message: "Accès refusé",
  },
  [ErrorCode.NotFound]: {
    status: HttpStatus.NOT_FOUND,
    message: "Ressource introuvable",
  },
  [ErrorCode.Conflict]: {
    status: HttpStatus.CONFLICT,
    message: "Conflit",
  },
  [ErrorCode.ValidationError]: {
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    message: "Validation échouée",
  },
  [ErrorCode.InternalServerError]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Erreur interne du serveur",
  },

  [ErrorCode.BookingAlreadyExists]: {
    status: HttpStatus.CONFLICT,
    message: "Cette personne est déjà inscrite à cette session",
  },
  [ErrorCode.TrainingSessionNotFound]: {
    status: HttpStatus.NOT_FOUND,
    message: "Session de formation introuvable",
  },
  [ErrorCode.TrainerNotFound]: {
    status: HttpStatus.NOT_FOUND,
    message: "Formateur introuvable",
  },
};
