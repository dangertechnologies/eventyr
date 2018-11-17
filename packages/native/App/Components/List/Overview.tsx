import React from "react";

/** COMPONENTS **/
import { TouchableOpacity } from "react-native";
import {
  CardItem,
  Body,
  Right,
  Left,
  H2,
  Text,
  ActionSheet
} from "native-base";
import Points from "./AchievementCount";

/** UTILS **/
import { findIndex } from "lodash";
import {
  withNavigation,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";

/** TYPES **/
import { List } from "@eventyr/graphql";

export interface LongPressAction {
  label: string;
  onPress(achievement: List): any;
  destructive?: boolean;
}

interface Props {
  list: List | null;

  onPress?(list: List): any;
  actions?: Array<LongPressAction>;
}

const Overview = ({ list, onPress, actions }: Props) => {
  if (!list) {
    return null;
  }

  return (
    <React.Fragment>
      <TouchableOpacity
        disabled={!onPress}
        onPress={() => onPress && onPress(list)}
        onLongPress={() =>
          actions &&
          ActionSheet.show(
            {
              title: list.title,
              options: actions.map(({ label }) => label).concat("Cancel"),
              cancelButtonIndex: actions.length,
              destructiveButtonIndex: findIndex(actions, "destructive")
            },
            (buttonIndex: number) =>
              buttonIndex !== actions.length &&
              actions[buttonIndex] &&
              actions[buttonIndex].onPress &&
              actions[buttonIndex].onPress(list)
          )
        }
      >
        <CardItem>
          <Left style={{ flexDirection: "row" }}>
            <Text note style={{ fontSize: 12 }}>
              List
            </Text>
          </Left>
        </CardItem>
        <CardItem>
          <Left style={{ flexGrow: 1 }}>
            <Body>
              <H2
                style={{ fontWeight: "bold" }}
                numberOfLines={1}
                allowFontScaling
              >
                {list.title}
              </H2>
              <Text note style={{ fontSize: 12 }}>
                {`List by ${list.author.name}`}
              </Text>
            </Body>
          </Left>
          <Right style={{ flex: 0.3 }}>
            <Points>{list.achievementsCount}</Points>
          </Right>
        </CardItem>
        <CardItem />
      </TouchableOpacity>
    </React.Fragment>
  );
};

export default Overview;
