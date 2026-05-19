"use client";

import type { TrainingSessionDto } from "@repo/api";
import { Badge } from "@repo/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { formatDateHuman } from "@repo/utils";
import { FC } from "react";

type Props = {
  sessions: TrainingSessionDto[];
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};

const statusVariants: Record<
  string,
  | "beige"
  | "black"
  | "blue"
  | "default"
  | "green"
  | "grey"
  | "orange"
  | "red"
  | "secondary"
  | "violet"
  | "white"
> = {
  pending: "blue",
  confirmed: "green",
  cancelled: "red",
};

export const SessionsTable: FC<Props> = ({ sessions }) => (
  <div className="rounded-lg border border-black-100 bg-white overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="border-b border-black-100 bg-black-50">
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-black-600 font-sans">Date</TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-black-600 font-sans">Session</TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-black-600 font-sans">Lieu</TableHead>
          <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-black-600 font-sans">Participants</TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-black-600 font-sans">Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow
            key={session.id}
            className="border-b border-black-50 hover:bg-beige-50 transition-colors"
          >
            <TableCell className="px-4 py-4 font-medium text-black-900">
              {formatDateHuman(new Date(session.startsAt))}
            </TableCell>
            <TableCell className="px-4 py-4 text-black-800">{session.title}</TableCell>
            <TableCell className="px-4 py-4 text-black-500">
              {session.location}
            </TableCell>
            <TableCell className="px-4 py-4 text-right tabular-nums text-black-700 font-medium">
              {session.bookingCount}
            </TableCell>
            <TableCell className="px-4 py-4">
              <Badge variant={statusVariants[session.status] || "default"}>
                {statusLabels[session.status] || session.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
