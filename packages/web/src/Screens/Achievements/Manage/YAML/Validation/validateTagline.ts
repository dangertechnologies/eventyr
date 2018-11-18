import { Objective } from "@eventyr/graphql";

const validateTagline = (objectives: Objective[]) => {
  const faulty = objectives.find(
    ({ tagline }) => !tagline || tagline.length < 5
  );

  if (faulty) {
    return `Objective "${
      faulty.tagline
    }" must have a name longer than 5 letters`;
  }

  return null;
};

export default validateTagline;
