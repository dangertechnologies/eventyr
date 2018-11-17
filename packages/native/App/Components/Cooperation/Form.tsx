import React from "react";
import { View } from "react-native";
import { compose } from "recompose";
import reformed, { ReformedProps } from "react-reformed";
import { Input, Icon, Button, Text } from "native-base";

import { Achievement, CoopRequest, User } from "@eventyr/graphql";
import { CooperationUserSelect } from "App/Components/User/UserList";
import { ValidationProps } from "react-reformed/lib/validateSchema";

import validateForm from "./Validate";
import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  achievement: Achievement;
  onSend(coopRequest: Model): any;
  onCancel(): any;
}

type Model = {
  message: string;
  users: Array<User>;
};

export type FormProps = ReformedProps<Model> & Props & ValidationProps<Model>;

export const Form = ({
  achievement,
  setProperty,
  model,
  onCancel,
  schema,
  onSend
}: FormProps) => (
  <React.Fragment>
    <View style={styles.messageArea}>
      <Text note style={styles.label}>
        Message
      </Text>

      <Input
        style={styles.message}
        multiline
        numberOfLines={3}
        onChangeText={(text: string) => setProperty("message", text)}
        placeholder="Write a message to send a cooperation request. You'll be notified if somebody accepts your request"
      />
      <View style={styles.sendButton}>
        <Button small transparent rounded onPress={onCancel}>
          <Text>Cancel</Text>
        </Button>
        <Button
          disabled={!schema.isValid}
          small
          bordered
          rounded
          iconRight
          onPress={() => onSend(model)}
        >
          <Text>Send</Text>
          <Icon name="send" style={styles.sendIcon} />
        </Button>
      </View>
    </View>

    <Text note style={styles.label}>
      {`People eligible for ${achievement.name}`}
    </Text>
    <CooperationUserSelect
      achievementId={achievement.id}
      onSelect={(users: Array<User>) => {
        console.log({ users });
        setProperty("users", users);
      }}
    />
  </React.Fragment>
);

const styles = EStyleSheet.create({
  label: {
    paddingLeft: "$spacing"
  },
  messageArea: {
    height: 145
  },
  message: {
    marginHorizontal: "$spacing"
  },

  sendIcon: {
    color: "$colorAccent"
  },
  sendButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "$spacing",
    marginVertical: "$spacing"
  }
});

export default compose<FormProps, Props>(
  reformed<Model>(),
  validateForm
)(Form);
