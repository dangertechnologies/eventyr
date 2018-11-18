import { QUERY_ACHIEVEMENTS_DETAILS, Achievement } from "@eventyr/graphql";
import createDataProvider from "./createDataProvider";

export default createDataProvider<Achievement, { id: string }>({
  query: QUERY_ACHIEVEMENTS_DETAILS,
  path: "achievement"
});
