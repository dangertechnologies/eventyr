import { compose, withProps } from "recompose";
import { mapValues, values, concat, flatten } from "lodash";
import validateSchema, {
  ValidationProps
} from "react-reformed/lib/validateSchema";
import { User } from "App/Types/GraphQL";

interface ProtoCoopRequest {
  message: string;
  users: Array<User>;
}

export default compose(
  validateSchema<ProtoCoopRequest>({
    message: {
      type: "string",
      test: (value: string, fail: Function) => {
        if (!value) {
          return fail("Please write a message");
        }
      }
    },
    users: {
      type: "object",
      test: (value: Array<User>, fail: Function) => {
        if (!value || !value.length) {
          return fail("You haven't selected any users to cooperate with");
        }
      }
    }
  }),
  withProps(({ schema }: ValidationProps<ProtoCoopRequest>) => ({
    validationErrors: flatten(
      concat([], values(mapValues(schema.fields, ({ errors }) => errors || [])))
    )
  }))
);
