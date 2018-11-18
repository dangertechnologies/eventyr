import { Achievement, Mode } from "@eventyr/graphql";

const validateDifficulties = (achievements: Achievement[]) => {
  const allowedDifficulties: Mode[] = [
    "EASY",
    "NORMAL",
    "DIFFICULT",
    "EXTREME"
  ];
  const faulty = achievements.find(
    achievement => !allowedDifficulties.includes(achievement.mode)
  );

  if (faulty) {
    return `${faulty.name} has an invalid difficulty: ${
      faulty.mode
    }. Must be one of: ${allowedDifficulties.join(", ")}`;
  }
  return null;
};

export default validateDifficulties;
