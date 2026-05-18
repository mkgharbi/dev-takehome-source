import { AppPages } from "@repo/api/constants";
import { redirect } from "next/navigation";


const HomePage = () => {
  redirect(AppPages.Trainers);
};

export default HomePage;
