import React from "react";
import { QUERY_ACHIEVEMENTS_NEARBY, AchievementEdge } from "@eventyr/graphql";
import createDataProvider from "./createDataProvider";

export default createDataProvider<
  AchievementEdge[],
  { latitude: number; longitude: number }
>({
  query: QUERY_ACHIEVEMENTS_NEARBY,
  path: "achievements.edges"
});
