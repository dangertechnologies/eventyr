import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { BlurView } from "react-native-blur";

import { BlackPortal } from "react-native-portal";
import { H1, Input, Form, Item, Label, Button, Text } from "native-base";
import { View } from "react-native-animatable";
import { Objective } from "graphqlTypes";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";
import { compose, mapProps } from "recompose";
// @ts-ignore
import reformed from "react-reformed";
import validateSchema from "react-reformed/lib/validateSchema";
import { mapValues } from "lodash";

interface ProtoObjective
  extends Omit<
      Objective,
      "achievements" | "createdAt" | "goal" | "goalType" | "hashIdentifier"
    > {
  color: string;
  lat?: number;
  lng?: number;
}

declare type EditableObjective =
  | ProtoObjective
  | Objective & { color: string; lat?: number; lng?: number };

interface Props {
  objective?: EditableObjective;
  isValid: boolean;
  validationErrors?: { [key: string]: string };
  onChange(objective: EditableObjective): any;
  setProperty(key: string, value: any): { [key: string]: string };
  model?: EditableObjective;
  schema: {
    isValid?: boolean;
    fields: {
      errors: Array<string>;
      isValid: boolean;
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
    alignSelf: "center",
    marginTop: "$spacing * -10"
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },

  submit: {
    backgroundColor: "$colorSecondary"
  },

  submitDisabled: {
    backgroundColor: "$colorSecondary",
    opacity: 0.2
  }
});
const ProtoObjectiveDialog = (props: Props) => {
  const { model, onChange, setProperty, schema } = props;

  const errors: { [key: string]: Array<string> } = mapValues(
    schema.fields,
    ({ errors }: { errors: Array<string> }) => errors
  );
  const { isValid } = schema;

  console.log({ errors });

  return !model ? null : (
    <BlackPortal name="outside">
      <View animation="fadeIn" style={StyleSheet.absoluteFill}>
        <BlurView blurType="light" style={StyleSheet.absoluteFill}>
          <SafeAreaView style={styles.container}>
            <Form style={styles.formContainer}>
              <H1
                style={{
                  fontWeight: "bold",
                  margin: EStyleSheet.value("$spacing")
                }}
              >
                New objective
              </H1>
              <Item
                fixedLabel
                error={Boolean(
                  errors && errors.tagline && errors.tagline.length
                )}
                success={Boolean(
                  !errors || !errors.tagline || !errors.tagline.length
                )}
              >
                <Label>Tagline</Label>
                <Input
                  placeholder="What's the objective?"
                  value={model.tagline}
                  onChangeText={tagline => setProperty("tagline", tagline)}
                />
              </Item>
              <Item
                stackedLabel
                error={Boolean(errors && errors.basePoints)}
                success={Boolean(
                  !errors || !errors.basePoints || !errors.basePoints.length
                )}
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
                  value={model.basePoints ? `${model.basePoints}` : undefined}
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
                onPress={() => onChange && onChange(model)}
              >
                <Text>Create</Text>
              </Button>
            </Form>
          </SafeAreaView>
        </BlurView>
      </View>
    </BlackPortal>
  );
};
export default compose<Props, {}>(
  mapProps(({ objective }: Props) => ({
    initialModel: objective,
    model: objective
  })),
  reformed(),
  validateSchema({
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
