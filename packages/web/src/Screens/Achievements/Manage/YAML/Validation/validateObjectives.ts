import { Achievement } from "@eventyr/graphql";
import validateCoordinates from "./validateCoordinates";
import validateTagline from "./validateTagline";

const validateObjectives = (achievements: Achievement[]) => {
  const errors = achievements
    .map(
      achievement =>
        validateCoordinates(achievement.objectives) ||
        validateTagline(achievement.objectives)
    )
    .filter(error => error !== null);

  return errors.length ? errors[0] : null;
};

export default validateObjectives;
