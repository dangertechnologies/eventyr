import React from "react";

/** PROVIDERS **/
import { withUser } from "App/Providers/UserProvider";

/** COMPONENTS **/
import { TouchableOpacity } from "react-native";
import {
  Card,
  CardItem,
  Body,
  Right,
  Left,
  H3,
  Text,
  Button
} from "native-base";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
// @ts-ignore
import Swipeable from "react-native-swipeable";
import AchievementIcon from "App/Components/AchievementIcon";

/** UTILS **/
import { compose } from "recompose";

/** TYPES **/
import { Achievement } from "App/Types/GraphQL";
import { UserContext } from "App/Providers/UserProvider";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  achievement: Achievement | null;

  onPress?(): any;
  onEdit?(achievement: Achievement): any;
  onDelete?(achievement: Achievement): any;
}

const AchievementCard = ({
  achievement,
  currentUser,
  onPress,
  onEdit,
  onDelete
}: Props & { currentUser: UserContext }) =>
  !achievement ? null : (
    <Card>
      <Swipeable
        swipeable={achievement.author.id === `${currentUser.id}`}
        rightButtons={[
          <Button
            style={styles.editButton}
            onPress={() => onEdit && onEdit(achievement)}
          >
            <Text style={{ textAlign: "center" }}>Edit</Text>
          </Button>,
          <Button
            style={styles.deleteButton}
            onPress={() => onDelete && onDelete(achievement)}
          >
            <Text style={{ textAlign: "center" }}>Delete</Text>
          </Button>
        ]}
      >
        <TouchableOpacity onPress={() => onPress && onPress()}>
          <CardItem>
            <Left style={{ flexDirection: "row" }}>
              <MaterialIcon name={achievement.type.icon} />
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
        </TouchableOpacity>
      </Swipeable>
    </Card>
  );

const styles = EStyleSheet.create({
  editButton: {
    width: "100%",
    height: "100%",
    backgroundColor: "orange",
    borderRadius: 0,
    margin: 0
  },
  deleteButton: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
    borderRadius: 0,
    margin: 0
  }
});

export default compose<Props & { currentUser: UserContext }, Props>(withUser)(
  AchievementCard
);