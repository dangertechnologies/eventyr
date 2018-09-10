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
import { Unlocked, Achievement } from "App/Types/GraphQL";
import { UserContext } from "App/Providers/UserProvider";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  unlocked: Unlocked;

  onPress?(): any;
  onVerify?(achievement: Unlocked): any;
}

const AchievementCard = ({
  unlocked,
  currentUser,
  onPress,
  onVerify
}: Props & { currentUser: UserContext }) => (
  <Card>
    <Swipeable
      swipeable={
        unlocked.user &&
        unlocked.user.id &&
        unlocked.user.id === `${currentUser.id}`
      }
      rightButtons={[
        <Button
          style={styles.verifyButton}
          onPress={() => onVerify && onVerify(unlocked)}
        >
          <Text style={{ textAlign: "center" }}>Verify</Text>
        </Button>
      ]}
    >
      <TouchableOpacity onPress={() => onPress && onPress()}>
        <CardItem>
          <Left style={{ flexDirection: "row" }}>
            <MaterialIcon name={unlocked.achievement.type.icon} />
            <Text note style={{ fontSize: 12 }}>
              {unlocked.achievement.type.name}
            </Text>
          </Left>

          <Right style={{ alignItems: "flex-end" }}>
            <Text note style={{ fontSize: 12 }}>
              {unlocked.achievement.mode.name}
            </Text>
          </Right>
        </CardItem>
        <CardItem>
          <Left style={{ flexGrow: 1 }}>
            <AchievementIcon
              name={unlocked.achievement.icon}
              size={40}
              difficulty={unlocked.achievement.mode.name}
            />
            <Body>
              <Text>{unlocked.achievement.name}</Text>
              <Text note>{unlocked.achievement.category.title}</Text>
            </Body>
          </Left>
          <Right style={{ flex: 0.3 }}>
            <H3>{unlocked.points}</H3>
          </Right>
        </CardItem>

        <CardItem />
      </TouchableOpacity>
    </Swipeable>
  </Card>
);

const styles = EStyleSheet.create({
  verifyButton: {
    width: "100%",
    height: "100%",
    backgroundColor: "#00AA00",
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
