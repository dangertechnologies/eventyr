import { Mode, Kind } from "../Types/GraphQL";

// Get static basepoints for a mode / location, used for preliminary
// points calculations

/**
 * Mode multipliers are now statically defined on the
 * server, and mode is returned as an enum, so this
 * needs to be in sync.
 *
 * This is only used to display the "expected" points
 * when creating / editing an Achievement, otherwise
 * the points for an achievement are retrieved from
 * the server.
 * @param mode
 */
export const modeMultiplier = (mode: Mode | null) => {
  switch ((mode || "").toLowerCase()) {
    case "easy":
      return 0.5;
    case "difficult":
      return 1.5;
    case "extreme":
      return 2.0;
    case "normal":
    default:
      return 1.0;
  }
};

export const kindPoints = (kind: Kind) => {
  switch ((kind || "").toLowerCase()) {
    case "action":
      return 25;
    case "discovery":
      return 35;
    case "route":
      return 50;
    case "location":
    default:
      return 15;
  }
};
