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
import KindIcon from "App/Components/KindIcon";
// @ts-ignore
import Swipeable from "react-native-swipeable";
import AchievementIcon from "App/Components/AchievementIcon";

/** UTILS **/
import { compose } from "recompose";
import { capitalize } from "lodash";

/** TYPES **/
import { Unlocked, Achievement } from "App/Types/GraphQL";
import { UserContext } from "App/Providers/UserProvider";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";
import Overview from "../Achievement/Overview";

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
      <Overview
        achievement={{ ...unlocked.achievement, points: unlocked.points }}
      />
      <CardItem />
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
