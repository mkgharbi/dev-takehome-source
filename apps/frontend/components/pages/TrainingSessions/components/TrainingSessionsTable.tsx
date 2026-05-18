import type { TrainingSessionDto } from "@repo/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { formatDateHuman, formatEur } from "@repo/utils";
import { FC } from "react";

import { BookingFormDialog } from "./BookingFormDialog";
import { TrainingSessionStatusBadge } from "./TrainingSessionStatusBadge";

type Props = {
  sessions: TrainingSessionDto[];
};

export const TrainingSessionsTable: FC<Props> = ({ sessions }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Session</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Lieu</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead className="text-right">Prix</TableHead>
        <TableHead className="text-right">Inscrits</TableHead>
        <TableHead className="w-32" />
      </TableRow>
    </TableHeader>
    <TableBody>
      {sessions.map((session) => (
        <TableRow key={session.id}>
          <TableCell>
            <div className="font-medium">{session.title}</div>
            <div className="text-xs text-muted-foreground">
              {session.trainerName}
            </div>
          </TableCell>
          <TableCell className="text-muted-foreground">
            {formatDateHuman(session.startsAt)}
          </TableCell>
          <TableCell className="text-muted-foreground">
            {session.location}
          </TableCell>
          <TableCell>
            <TrainingSessionStatusBadge status={session.status} />
          </TableCell>
          <TableCell className="text-right tabular-nums">
            {formatEur(session.priceCents)}
          </TableCell>
          <TableCell className="text-right tabular-nums">
            {session.bookingCount} / {session.capacity}
          </TableCell>
          <TableCell className="text-right">
            <BookingFormDialog
              sessionId={session.id}
              sessionTitle={session.title}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
