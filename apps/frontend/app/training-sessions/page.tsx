import type { Metadata } from "next";

import { TrainingSessions } from "@/components/pages/TrainingSessions/TrainingSessions";

export const metadata: Metadata = {
  title: "Sessions",
};

const TrainingSessionsPage = () => <TrainingSessions />;

export default TrainingSessionsPage;
