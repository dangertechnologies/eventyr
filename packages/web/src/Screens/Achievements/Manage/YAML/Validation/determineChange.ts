import { Achievement } from "@eventyr/graphql";
import isEqual from "lodash/isEqual";
import pick from "lodash/pick";

type ChangeState =
  | "UNCHANGED"
  | "OBJECTIVES_REMOVED"
  | "OBJECTIVES_UPDATED"
  | "NEW_OBJECTIVES"
  | "UPDATED"
  | "NEW";

const findState = (
  needle: Achievement,
  haystack: Achievement[]
): ChangeState => {
  if (haystack.map(achievement => achievement.name).includes(needle.name)) {
    const original = haystack.find(
      achievement => achievement.name === needle.name
    ) as Achievement;

    // Check if the fields that can be edited with YAML have changed
    if (
      isEqual(
        pick(original, ["name", "fullDescription", "difficulty"]),
        pick(needle, ["name", "fullDescription", "difficulty"])
      )
    ) {
      // If the fields have changed, compare the objectives
      if (
        isEqual(
          original.objectives.map(o => pick(o, ["tagline", "lat", "lng"])),
          needle.objectives.map(o => pick(o, ["tagline", "lat", "lng"]))
        )
      ) {
        // If objectives are the same as well, return unchanged
        if (isEqual(original.category.title, needle.category.title)) {
          return "UNCHANGED";
        } else {
          return "UPDATED";
        }
      } else {
        // Check if the original had more objectives
        if (original.objectives.length > needle.objectives.length) {
          return "OBJECTIVES_REMOVED";
        } else if (original.objectives.length < needle.objectives.length) {
          // Check if the new one had more objectives
          return "NEW_OBJECTIVES";
        } else {
          // If objectives aren't equal but the length hasn't changed,
          // some data has changed in the objectives.
          return "OBJECTIVES_UPDATED";
        }
      }
    } else {
      return "UPDATED";
    }
  } else {
    return "NEW";
  }
};
export default findState;
