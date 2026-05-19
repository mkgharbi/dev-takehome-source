import type { Metadata } from "next";

import { TrainerDashboard } from "@/components/pages/TrainerDashboard/TrainerDashboard";

export const metadata: Metadata = {
  title: "Tableau de bord formateur",
};

type Props = {
  params: Promise<{ trainerId: string }>;
};

const TrainerDashboardPage = async ({ params }: Props) => {
  const { trainerId } = await params;
  return <TrainerDashboard trainerId={trainerId} />;
};

export default TrainerDashboardPage;
