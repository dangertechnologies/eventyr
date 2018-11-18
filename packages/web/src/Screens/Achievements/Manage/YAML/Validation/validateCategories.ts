import { Achievement, Category } from "@eventyr/graphql";

const validateCategories = (
  achievements: Achievement[],
  categories: Category[]
) => {
  const allowedCategories = categories.map(({ title }: Category) => title);
  const faulty = achievements.find(
    achievement => !allowedCategories.includes(achievement.category.title)
  );

  if (faulty) {
    return `${faulty.name} has an invalid category ${
      faulty.category.title
    }. Must be one of: ${allowedCategories.join(", ")}`;
  }
  return null;
};

export default validateCategories;
