"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { FC } from "react";

import { TrainersTable } from "./components/TrainersTable";

import { useTrainers } from "@/services/api/trainer/trainer";


export const Trainers: FC = () => {
  const { data, error, isLoading } = useTrainers();

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
          Erreur lors du chargement des formateurs.
        </p>
      </main>
    );
  }

  const trainers = data?.items ?? [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Formateurs</CardTitle>
          <CardDescription>
            {data?.total ?? 0} formateurs actifs sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trainers.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Aucun formateur pour le moment.
            </p>
          ) : (
            <TrainersTable trainers={trainers} />
          )}
        </CardContent>
      </Card>
    </main>
  );
};
