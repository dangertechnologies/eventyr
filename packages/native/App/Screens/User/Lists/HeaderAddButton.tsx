import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon, Text } from "native-base";
import EStyleSheet from "react-native-extended-stylesheet";
import { NavigationScreenProp, NavigationState } from "react-navigation";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

export const HeaderAddButton = ({ navigation }: Props) =>
  !navigation.getParam("showAddForm") ? (
    <TouchableOpacity onPress={navigation.getParam("onAdd")}>
      <Icon name="plus" style={styles.addButton} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={navigation.getParam("onCancel")}>
      <Text style={styles.cancelButton}>Cancel</Text>
    </TouchableOpacity>
  );

const styles = EStyleSheet.create({
  addButton: {
    paddingHorizontal: "$spacing",
    color: "$colorSecondary",
    fontSize: "$iconSize"
  },

  cancelButton: { color: "#FFFFFF", marginRight: "$spacingDouble" }
});
