import React from "react";
import { View } from "react-native";

/** PROVIDERS **/
import { withUser, UserContext } from "@eventyr/core/Providers";

/** COMPONENTS **/
import { Card, CardItem, Text, Right } from "native-base";

/** UTILS **/
import { compose } from "recompose";
import { isEqual, round } from "lodash";
// @ts-ignore
import distance from "haversine-distance";

/** TYPES **/
import { Achievement, User } from "@eventyr/graphql";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";
import Overview, { LongPressAction } from "../Achievement/Overview";
import withLocation, {
  LocationContext
} from "../../Providers/LocationProvider";
import RemoteImage from "../RemoteImage";

interface Props {
  achievement: Achievement | null;
  isVotable?: boolean;

  onPress?(): any;
  actions?: Array<LongPressAction>;
}

interface ComposedProps extends Props {
  location: LocationContext;
  currentUser: UserContext;
}

const AchievementCard = ({
  achievement,
  currentUser,
  onPress,
  location,
  actions,
  isVotable
}: ComposedProps & { currentUser: UserContext }) => {
  if (!achievement) {
    return null;
  }

  const canEdit =
    achievement.author && isEqual(achievement.author.id, `${currentUser.id}`);

  let kmAway =
    achievement.objectives &&
    achievement.objectives &&
    achievement.objectives
      .map(node =>
        node && node.lat && node.lng ? distance(node, location) || null : null
      )
      .sort()[0];

  kmAway =
    kmAway && kmAway > 1000 ? `${round(kmAway / 1000)}km` : `${round(kmAway)}m`;

  return (
    <Card transparent>
      <View style={styles.card}>
        <Overview
          achievement={achievement}
          onPress={onPress}
          actions={actions}
        />
        {!isVotable && kmAway && (
          <CardItem>
            <Text note style={styles.distance}>
              {kmAway}
            </Text>

            {achievement.cooperationUsers && (
              <View style={styles.cooperationUsers}>
                {achievement.cooperationUsers.map((user: User) => (
                  <RemoteImage
                    key={`achievement:${achievement.id}:avatar:${user.id}`}
                    source={{ uri: user.avatar as string }}
                    style={styles.tinyAvatar}
                  />
                ))}
              </View>
            )}
          </CardItem>
        )}
      </View>
    </Card>
  );
};
const styles = EStyleSheet.create({
  card: {
    borderRadius: 8,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "rgba(0, 0, 0, 1)",
    shadowOpacity: 0.1,
    backgroundColor: "#FFFFFF",
    padding: 5,
    marginHorizontal: "$spacing"
  },

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
  },

  distance: {
    fontSize: 11
  },

  tinyAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10
  },

  cooperationUsers: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    flex: 1
  }
});

export default compose<ComposedProps, Props>(
  withLocation(),
  withUser
)(AchievementCard);
