import { Achievement } from "@eventyr/graphql";

interface TextAreaProps {
  initialAchievements: Achievement[];
}

type YAMLObjective =
  | {
      [tagline: string]: string;
    }
  | string;

type YAMLAchievement = {
  [name: string]: {
    description: Achievement["fullDescription"];
    category: Achievement["category"]["title"];
    difficulty: Achievement["mode"];
    objectives: YAMLObjective[];
  };
};

export const yamlToAchievements = (
  yml: YAMLAchievement[]
): Array<Partial<Achievement>> =>
  yml.map(achievement => ({
    name: Object.keys(achievement)[0],
    fullDescription: achievement[Object.keys(achievement)[0]]
      .description as string,
    shortDescription: achievement[Object.keys(achievement)[0]]
      .description as string,
    mode: achievement[Object.keys(achievement)[0]].difficulty,
    category: {
      id: "0",
      icon: "",
      points: 0,
      title: achievement[Object.keys(achievement)[0]].category
    },
    objectives: achievement[Object.keys(achievement)[0]].objectives.map(
      objective =>
        typeof objective === "string"
          ? {
              id: "0",
              tagline: objective,
              kind: "ACTION",
              lat: null,
              lng: null,
              achievements: [],
              altitude: 0,
              basePoints: 0,
              country: null,
              createdAt: new Date().getTime() / 1000,
              updatedAt: new Date().getTime() / 1000,
              fromTimestamp: null,
              toTimestamp: null,
              isPublic: true,
              requiredCount: 1,
              timeConstraint: null
            }
          : {
              id: "0",
              tagline: Object.keys(objective)[0],
              lat: objective[Object.keys(objective)[0]].split(/,\s?/).length
                ? parseFloat(
                    objective[Object.keys(objective)[0]].split(/,\s?/)[0]
                  )
                : null,
              lng: objective[Object.keys(objective)[0]].split(/,\s?/).length
                ? parseFloat(
                    objective[Object.keys(objective)[0]].split(/,\s?/)[1]
                  )
                : null,
              kind: "LOCATION",
              achievements: [],
              altitude: 0,
              basePoints: 0,
              country: null,
              createdAt: new Date().getTime() / 1000,
              updatedAt: new Date().getTime() / 1000,
              fromTimestamp: null,
              toTimestamp: null,
              isPublic: true,
              requiredCount: 1,
              timeConstraint: null
            }
    )
  }));

export const achievementsToYaml = (
  achievements: Achievement[]
): YAMLAchievement[] =>
  achievements.map(achievement => ({
    [achievement.name]: {
      description: achievement.fullDescription || "",
      difficulty: achievement.mode,
      category: achievement.category.title,
      objectives: achievement.objectives.map(objective =>
        objective.lat && objective.lng
          ? {
              [objective.tagline]: `${objective.lat}, ${objective.lng}`
            }
          : objective.tagline
      )
    }
  }));
