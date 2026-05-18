import { TrainingSessionStatus } from "@repo/api/constants";
import { Badge } from "@repo/ui/badge";
import { FC } from "react";

type Props = {
  status: TrainingSessionStatus;
};

const STATUS_LABEL: Record<TrainingSessionStatus, string> = {
  [TrainingSessionStatus.Pending]: "En attente",
  [TrainingSessionStatus.Confirmed]: "Confirmée",
  [TrainingSessionStatus.Cancelled]: "Annulée",
};

const STATUS_VARIANT: Record<
  TrainingSessionStatus,
  "orange" | "green" | "red"
> = {
  [TrainingSessionStatus.Pending]: "orange",
  [TrainingSessionStatus.Confirmed]: "green",
  [TrainingSessionStatus.Cancelled]: "red",
};

export const TrainingSessionStatusBadge: FC<Props> = ({ status }) => (
  <Badge variant={STATUS_VARIANT[status]} compact>
    {STATUS_LABEL[status]}
  </Badge>
);
