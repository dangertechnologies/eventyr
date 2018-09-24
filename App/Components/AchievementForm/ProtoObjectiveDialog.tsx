import React from "react";

/** COMPONENTS **/
import { Input, Form, Item, Label, Button, Text } from "native-base";
import Dialog from "App/Components/Dialog";

/** UTILS **/
import reformed from "react-reformed";
import { compose, withProps } from "recompose";
import validateSchema from "react-reformed/lib/validateSchema";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

/** TYPES **/
import { EditableObjective, ProtoObjective } from "App/Types/Prototypes";

interface Props {
  objective?: EditableObjective;
  onChange(objective: EditableObjective): any;
  onClose(): any;
}

interface ComposedProps extends Props {
  isValid: boolean;
  validationErrors?: { [key: string]: string };
  setProperty(key: string, value: any): { [key: string]: string };
  model?: EditableObjective;
  setModel(model: EditableObjective | undefined): any;
  initialModel?: EditableObjective;
  schema: {
    isValid?: boolean;
    fields: {
      [key: string]: {
        errors: Array<string>;
        isValid: boolean;
      };
    };
  };
}

const styles = EStyleSheet.create({
  slider: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center"
  },

  points: {
    fontSize: 48,
    color: "#009900",
    textAlign: "center"
  },

  formContainer: {
    width: "100% - $spacingDouble",
    alignSelf: "center"
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },

  submit: {
    backgroundColor: "$colorPrimary"
  },

  submitDisabled: {
    backgroundColor: "$colorPrimary",
    opacity: 0.2
  }
});

const ProtoObjectiveDialog = (props: ComposedProps) => {
  const {
    initialModel,
    objective,
    model,
    onChange,
    setProperty,
    schema,
    onClose,
    setModel
  } = props;

  const { isValid } = schema;

  return (
    <Dialog open={Boolean(objective)} onClose={onClose} title="New objective">
      <Form style={styles.formContainer}>
        <Item
          fixedLabel
          error={Boolean(!schema.fields.tagline.isValid)}
          success={Boolean(schema.fields.tagline.isValid)}
        >
          <Label>Tagline</Label>
          <Input
            placeholder="What's the objective?"
            value={model && model.tagline}
            onChangeText={tagline => setProperty("tagline", tagline)}
          />
        </Item>
        <Item
          stackedLabel
          error={Boolean(schema.fields.basePoints.isValid)}
          success={!schema.fields.basePoints.isValid}
          style={{
            borderBottomWidth: 0,
            height: 150
          }}
        >
          <Label>Points</Label>

          <Input
            style={styles.points}
            keyboardType="numeric"
            placeholder="35"
            value={
              model && model.basePoints ? `${model.basePoints}` : undefined
            }
            onChangeText={points =>
              setProperty("basePoints", parseInt(points, 10))
            }
          />
        </Item>

        <Button
          full
          style={!isValid ? styles.submitDisabled : styles.submit}
          disabled={!isValid}
          rounded
          onPress={() => {
            model && onChange && onChange({ ...initialModel, ...model });
            setModel(initialModel);
          }}
        >
          <Text>Create</Text>
        </Button>
      </Form>
    </Dialog>
  );
};

export default compose<ComposedProps, Props>(
  withProps(({ objective, ...rest }: Props) => ({
    ...rest,
    initialModel: objective,
    model: objective
  })),
  reformed<ProtoObjective>(),
  validateSchema<ProtoObjective>({
    tagline: {
      type: "string",
      required: true,
      test: (value: string, fail: Function) => {
        if (!value) {
          return fail("Please give the objective a name");
        }
        if (value.length < 4) {
          return fail("Tagline must be more than 4 characters");
        }
      }
    },
    basePoints: {
      type: "number",
      test: (value: number, fail: Function) => {
        if (!value) {
          return fail("An objective must yield points");
        }
        if (value > 50) {
          return fail("Maximum 50 points per objective");
        }

        if (value < 5) {
          return fail("Minimum 5 points per objective");
        }
      }
    }
  })
)(ProtoObjectiveDialog);
