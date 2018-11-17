import React from "react";

/** PROVIDERS **/
import { withUIHelpers, UIContext } from "App/Providers/UIProvider";
import { withUser, UserContext } from "@eventyr/core/Providers";
import withLocation, { LocationContext } from "App/Providers/LocationProvider";

/** COMPONENTS **/
import { FlatList, FlatListProps } from "react-native";
import AchievementCard from "App/Components/Cards/Achievement";
import ListCard from "App/Components/Cards/List";
import Loading from "App/Components/Loading";

/** UTILS */
import { compose } from "recompose";
import { concat } from "lodash";

/** TYPES **/
import {
  NavigationScreenProp,
  NavigationState,
  withNavigation
} from "react-navigation";
import { Achievement, List, ListEdge, AchievementEdge } from "@eventyr/graphql";

import Overview from "App/Components/List/Overview";
import { LongPressAction } from "App/Components/Achievement/Overview";
import withAchievementActions, {
  Actions
} from "App/Components/withAchievementActions";

interface Props
  extends Omit<FlatListProps<ListEdge | AchievementEdge>, "renderItem"> {
  feed?: Array<ListEdge | AchievementEdge>;
}

interface ComposedProps extends Props {
  navigation: NavigationScreenProp<NavigationState>;
  ui: UIContext;
  location: LocationContext;
  currentUser: UserContext;
  actions: Actions;
}

const Feed = ({ currentUser, location, actions, ...rest }: ComposedProps) => (
  <React.Fragment>
    <FlatList
      {...rest}
      keyExtractor={({ node }) =>
        // @ts-ignore
        node && node.__typename === "List"
          ? `List:${node && node.id}`
          : `Achievement:${node && node.id}`
      }
      renderItem={({ item }) =>
        // @ts-ignore
        item.node.__typename === "List" ? (
          <ListCard>
            <Overview
              onPress={actions.viewDetails}
              list={item.node as List}
              actions={[
                {
                  label: "Share",
                  onPress: actions.shareList
                }
              ]}
            />
          </ListCard>
        ) : (
          <AchievementCard
            achievement={item.node as Achievement}
            actions={concat(
              [
                {
                  label: "Share",
                  onPress: actions.shareAchievement
                },
                {
                  label: "Add to List",
                  onPress: actions.addToLists
                },
                {
                  label: "Cooperate",
                  onPress: actions.requestCooperation
                }
              ],
              item &&
                item.node &&
                item.node.author &&
                item.node.author.id === `${currentUser.id}`
                ? ([
                    {
                      label: "Edit",
                      onPress: actions.editAchievement
                    },
                    {
                      label: "Delete",
                      onPress: actions.deleteAchievement,
                      destructive: true
                    }
                  ] as Array<LongPressAction>)
                : []
            )}
            onPress={() => item.node && actions.viewDetails(item.node)}
          />
        )
      }
    />
  </React.Fragment>
);

export default compose<ComposedProps, Props>(
  withUser,
  withLocation({ watch: true }),
  withUIHelpers,
  withNavigation,
  withAchievementActions
)(Feed);
