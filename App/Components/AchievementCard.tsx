import React from "react";
import { Card, CardItem, Body, Right, Left, H3, Text } from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AchievementIcon from "./AchievementIcon";

import { Achievement } from "graphqlTypes";
import { TouchableOpacity } from "react-native";

interface Props {
  achievement: Achievement | null;
  onPress?(): any;
}

const AchievementCard = ({ achievement, onPress }: Props) =>
  !achievement ? null : (
    <TouchableOpacity onPress={() => onPress && onPress()}>
      <Card>
        <CardItem>
          <Left style={{ flexDirection: "row" }}>
            <Icon name={achievement.type.icon} />
            <Text note style={{ fontSize: 12 }}>
              {achievement.type.name}
            </Text>
          </Left>

          <Right style={{ alignItems: "flex-end" }}>
            <Text note style={{ fontSize: 12 }}>
              {achievement.mode.name}
            </Text>
          </Right>
        </CardItem>
        <CardItem>
          <Left style={{ flexGrow: 1 }}>
            <AchievementIcon
              name={achievement.icon}
              size={40}
              difficulty={achievement.mode.name}
            />
            <Body>
              <Text>{achievement.name}</Text>
              <Text note>{achievement.category.title}</Text>
            </Body>
          </Left>
          <Right style={{ flex: 0.3 }}>
            <H3>{achievement.points}</H3>
          </Right>
        </CardItem>

        <CardItem />
      </Card>
    </TouchableOpacity>
  );

export default AchievementCard;
