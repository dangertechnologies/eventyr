import React from "react";
import { Achievement } from "@eventyr/graphql";
import AchievementTable from "./AchievementsTable";

export interface PreviewProps {
  achievements: Array<Array<string | Achievement>>;
}

const Preview = ({ achievements }: PreviewProps) => {
  return <AchievementTable achievements={achievements} />;
};

export default Preview;
