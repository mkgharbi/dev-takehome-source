import { Badge } from "@repo/ui/badge";
import { FC } from "react";

type Props = {
  certifications: string[];
};

export const CertificationsBadges: FC<Props> = ({ certifications }) => (
  <div className="flex flex-wrap gap-1">
    {certifications.map((c) => (
      <Badge key={c} variant="orange" compact>
        {c}
      </Badge>
    ))}
  </div>
);
