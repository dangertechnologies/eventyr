import { Category, Type, Mode, Achievement, Objective } from "./GraphQL";

export interface ProtoObjective
  extends Omit<
      Objective,
      "achievements" | "createdAt" | "kind" | "hashIdentifier" | "altitude"
    > {
  kind: "LOCATION" | "ACTION";
  altitude?: number | null;
}

export type EditableObjective = ProtoObjective | Objective;

export interface ProtoAchievement
  extends Omit<
      Achievement,
      | "id"
      | "objectives"
      | "author"
      | "type"
      | "mode"
      | "category"
      | "hasParents"
      | "points"
    > {
  // This allows us to pass in existing objectives and show them on the map, when editing existing achivements
  objectives: Array<EditableObjective>;

  type: Type | null;
  mode: Mode | null;
  category: Category | null;
}
