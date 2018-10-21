import React from "react";
import { View } from "react-native";
import { compose } from "recompose";
import reformed, { ReformedProps } from "react-reformed";
import { Icon, Button, Text } from "native-base";

import { User } from "App/Types/GraphQL";
import FriendUserSelect from "App/Components/User/FriendList";
import { ValidationProps } from "react-reformed/lib/validateSchema";

import validateForm from "./Validate";
import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  onSend(coopRequest: Model): any;
  onCancel(): any;
}

type Model = {
  users: Array<User>;
};

export type FormProps = ReformedProps<Model> & Props & ValidationProps<Model>;

export const Form = ({
  setProperty,
  model,
  onCancel,
  schema,
  onSend
}: FormProps) => (
  <React.Fragment>
    <View style={styles.messageArea}>
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

    <FriendUserSelect
      onSelect={(users: Array<User>) => {
        console.log({ users });
        setProperty("users", users);
      }}
    />
  </React.Fragment>
);

const styles = EStyleSheet.create({
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
