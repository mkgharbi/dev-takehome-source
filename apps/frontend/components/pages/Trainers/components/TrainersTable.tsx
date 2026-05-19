import type { TrainerDto } from "@repo/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import Link from "next/link";
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
            <Link
              href={`/trainers/${trainer.id}`}
              className="text-blue-600 hover:underline"
            >
              {trainer.firstName} {trainer.lastName}
            </Link>
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
