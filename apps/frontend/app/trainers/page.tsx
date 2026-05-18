import type { Metadata } from "next";

import { Trainers } from "@/components/pages/Trainers/Trainers";

export const metadata: Metadata = {
  title: "Formateurs",
};

const TrainersPage = () => <Trainers />;

export default TrainersPage;
