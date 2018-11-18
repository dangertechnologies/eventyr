import React from "react";
import { QUERY_USER_ACHIEVEMENTS, AchievementEdge } from "@eventyr/graphql";
import createDataProvider from "./createDataProvider";

export default createDataProvider<AchievementEdge[], { id: string }>({
  query: QUERY_USER_ACHIEVEMENTS,
  path: "achievements.edges"
});
