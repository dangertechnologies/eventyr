import { Objective } from "@eventyr/graphql";

const validateCoordinates = (objectives: Objective[]) => {
  const faulty = objectives.find(
    objective =>
      Boolean(objective.lat && !objective.lng) ||
      Boolean(!objective.lat && objective.lng)
  );

  if (faulty) {
    return `${
      faulty.tagline
    } has invalid coordinates. Either both latitude and longitude must be defined, or neither.`;
  }
  return null;
};
export default validateCoordinates;
