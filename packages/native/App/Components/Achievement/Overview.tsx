import React from "react";

/** COMPONENTS **/
import { TouchableOpacity } from "react-native";
import {
  CardItem,
  Body,
  Right,
  Left,
  H3,
  H2,
  Text,
  Button,
  Icon,
  ActionSheet
} from "native-base";

import KindIcon from "App/Components/KindIcon";
import Difficulty from "App/Components/Achievement/Difficulty";
import Points from "App/Components/Achievement/Points";
import AchievementIcon from "App/Components/AchievementIcon";

/** UTILS **/
import { capitalize, round, findIndex } from "lodash";

/** TYPES **/
import { Achievement } from "@eventyr/graphql";

export interface LongPressAction {
  label: string;
  onPress(achievement: Achievement): any;
  destructive?: boolean;
}

interface Props {
  achievement: Achievement | null;
  isVotable?: boolean;

  onPress?(achievement: Achievement): any;
  actions?: Array<LongPressAction>;
}

const Overview = ({ achievement, onPress, actions, isVotable }: Props) => {
  if (!achievement) {
    return null;
  }

  return (
    <React.Fragment>
      <TouchableOpacity
        disabled={!onPress}
        onPress={() => onPress && onPress(achievement)}
        onLongPress={() =>
          actions &&
          ActionSheet.show(
            {
              title: achievement.name,
              options: actions.map(({ label }) => label).concat("Cancel"),
              cancelButtonIndex: actions.length,
              destructiveButtonIndex: findIndex(actions, "destructive")
            },
            (buttonIndex: number) =>
              buttonIndex !== actions.length &&
              actions[buttonIndex] &&
              actions[buttonIndex].onPress &&
              actions[buttonIndex].onPress(achievement)
          )
        }
      >
        <CardItem>
          <Left style={{ flexDirection: "row" }}>
            <KindIcon kind={achievement.kind} />
            <Text note style={{ fontSize: 12 }}>
              {capitalize(achievement.kind)}
            </Text>
          </Left>

          <Right style={{ alignItems: "flex-end" }}>
            <Difficulty level={achievement.mode} />
          </Right>
        </CardItem>
        <CardItem>
          <Left style={{ flexGrow: 1 }}>
            <AchievementIcon
              name={achievement.icon.replace("_", "-")}
              size={30}
            />
            <Body>
              <H2
                style={{ fontWeight: "bold" }}
                numberOfLines={1}
                allowFontScaling
              >
                {achievement.name}
              </H2>
              <Text note>{achievement.category.title}</Text>
            </Body>
          </Left>
          <Right style={{ flex: 0.3 }}>
            <Points>{round(achievement.points)}</Points>
          </Right>
        </CardItem>
      </TouchableOpacity>
      {isVotable && (
        <CardItem>
          <Body
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Button transparent small>
              <Text>Upvote</Text>
              <Icon name="arrow-up" />
            </Button>
            <H3>{achievement.upvotes || 0}</H3>
            <Button transparent small>
              <Icon name="arrow-down" />
              <Text>Downvote</Text>
            </Button>
          </Body>
        </CardItem>
      )}
    </React.Fragment>
  );
};

export default Overview;
