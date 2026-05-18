"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { FC } from "react";

import { TrainingSessionsTable } from "./components/TrainingSessionsTable";

import { useTrainingSessions } from "@/services/api/training-session/training-session";


export const TrainingSessions: FC = () => {
  const { data, error, isLoading } = useTrainingSessions();

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm text-destructive">
          Erreur lors du chargement des sessions.
        </p>
      </main>
    );
  }

  const sessions = data?.items ?? [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Sessions de formation</CardTitle>
          <CardDescription>
            {data?.total ?? 0} sessions à venir sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Aucune session pour le moment.
            </p>
          ) : (
            <TrainingSessionsTable sessions={sessions} />
          )}
        </CardContent>
      </Card>
    </main>
  );
};
