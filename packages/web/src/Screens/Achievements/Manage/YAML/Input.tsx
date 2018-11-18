import React from "react";
import { TextField, Button } from "@material-ui/core";
import { compose, withStateHandlers } from "recompose";
import { QUERY_TAXONOMY, Query, Achievement, Category } from "@eventyr/graphql";
import { graphql, DataValue } from "react-apollo";
import validateAchievements from "./Validation";

import yaml from "js-yaml";
import { achievementsToYaml, yamlToAchievements } from "./Converters";

export interface TextAreaProps {
  onParse(achievements: Achievement[]): any;
  initialText: string;
}

interface InnerTextAreaProps extends TextAreaProps {
  setText(text: string): any;
  data: DataValue<Pick<Query, "categories">>;
}
type State = {
  text: string;
  error?: string;
};

const TextArea = ({ text, setText, error }: InnerTextAreaProps & State) => (
  <TextField
    multiline
    style={{ height: "100%" }}
    value={text}
    fullWidth
    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
      setText(event.target.value)
    }
    error={Boolean(error && error !== "")}
    helperText={Boolean(error && error !== "") ? error : ""}
  />
);

export default compose<InnerTextAreaProps & State, TextAreaProps>(
  graphql(QUERY_TAXONOMY),
  withStateHandlers<State, {}>(
    ({ initialText }: any) => ({
      text: initialText,
      error: ""
    }),
    {
      setText: (_: State, { data, onParse }: InnerTextAreaProps) => (
        text: string
      ) => {
        try {
          const parsedYaml = yaml.load(text);
          const achievements = yamlToAchievements(parsedYaml);
          const error = validateAchievements(
            achievements as Achievement[],
            data.categories && data.categories.edges
              ? data.categories.edges.map(({ node }) => node as Category)
              : []
          );

          if (error) {
            throw new Error(error);
          }

          onParse(achievements as Achievement[]);
          return {
            text,
            error: ""
          };
        } catch (error) {
          return {
            text,
            error: `Something went wrong parsing your achievements: ${
              error.message
            }`
          };
        }
      }
    }
  )
)(TextArea);
