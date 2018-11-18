import { Achievement, Category } from "@eventyr/graphql";
import validateDifficulties from "./validateDifficulties";
import validateCategories from "./validateCategories";
import validateObjectives from "./validateObjectives";

const validateAchievements = (
  achievements: Achievement[],
  categories: Category[]
) => {
  return (
    validateDifficulties(achievements) ||
    validateCategories(achievements, categories) ||
    validateObjectives(achievements) ||
    null
  );
};

export default validateAchievements;
