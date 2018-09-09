import { compose, withProps } from "recompose";
import { mapValues, values, concat, flatten } from "lodash";
import validateSchema, {
  ValidationProps
} from "react-reformed/lib/validateSchema";
import { Category, Mode, Achievement } from "graphqlTypes";

import { EditableObjective, ProtoAchievement } from "./types";

export default compose(
  validateSchema<ProtoAchievement | Achievement>({
    name: {
      type: "string",
      test: (value: string, fail: Function) => {
        if (!value) {
          return fail("Your achievement needs a name, and an icon");
        } else if (value.length < 4) {
          return fail("The name must be longer than that");
        } else if (value.length > 100) {
          return fail("Keep the achievement name short and concise.");
        }
      }
    },
    icon: {
      type: "string",
      test: (value: string, fail: Function) => {
        if (!value) {
          return fail("Pick an icon by clicking the icon");
        }
      }
    },
    category: {
      type: "object",
      test: (value: Category, fail: Function) => {
        if (!value || !value.id) {
          return fail("Pick a category");
        }
      }
    },
    fullDescription: {
      type: "string",
      test: (value: string, fail: Function) => {
        if (!value) {
          return fail("Provide a description");
        } else if (value.length < 50) {
          return fail("Remember: Descriptions should be verbose");
        }
      }
    },

    mode: {
      type: "object",
      test: (value: Mode, fail: Function) => {
        if (!value || !value.id) {
          return fail("Select a Difficulty");
        }
      }
    },
    objectives: {
      type: "object",
      test: (value: EditableObjective[], fail: Function) => {
        if (value.length < 1) {
          return fail("Add some objectives to complete!");
        }
      }
    }
  }),
  withProps(({ schema }: ValidationProps<ProtoAchievement>) => ({
    validationErrors: flatten(
      concat([], values(mapValues(schema.fields, ({ errors }) => errors || [])))
    )
  }))
);
