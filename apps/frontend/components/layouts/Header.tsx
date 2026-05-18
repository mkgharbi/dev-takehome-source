import { AppPages } from "@repo/api/constants";
import Link from "next/link";
import { FC } from "react";

export const Header: FC = () => (
  <header className="border-b bg-background">
    <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
      <Link href={AppPages.Home} className="font-semibold">
        Certalis
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href={AppPages.Trainers}
          className="text-muted-foreground hover:text-foreground"
        >
          Formateurs
        </Link>
        <Link
          href={AppPages.TrainingSessions}
          className="text-muted-foreground hover:text-foreground"
        >
          Sessions
        </Link>
      </nav>
    </div>
  </header>
);
