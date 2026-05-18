import type { TrainerDto } from "@repo/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { FC } from "react";

import { CertificationsBadges } from "./CertificationsBadges";

type Props = {
  trainers: TrainerDto[];
};

export const TrainersTable: FC<Props> = ({ trainers }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nom</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Certifications</TableHead>
        <TableHead className="text-right">Sessions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {trainers.map((trainer) => (
        <TableRow key={trainer.id}>
          <TableCell className="font-medium">
            {trainer.firstName} {trainer.lastName}
          </TableCell>
          <TableCell className="text-muted-foreground">
            {trainer.email}
          </TableCell>
          <TableCell>
            <CertificationsBadges certifications={trainer.certifications} />
          </TableCell>
          <TableCell className="text-right tabular-nums">
            {trainer.sessionCount}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
