import React from "react";

/** PROVIDERS **/
import { withUIHelpers } from "App/Providers/UIProvider";

/** COMPONENTS **/
import { View, FlatList, Alert } from "react-native";
import { Container, Content, Text } from "native-base";
import LottieView from "lottie-react-native";
import AchievementCard from "App/Components/Cards/Achievement";

/** UTILS */
import { withProps, compose } from "recompose";

/** GRAPHQL **/
import { graphql } from "react-apollo";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

/** TYPES **/
import gql from "graphql-tag";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { Query, Achievement } from "App/Types/GraphQL";
import { ApolloQueryResult } from "apollo-client";
import { MutateProps } from "react-apollo";
import { UIContext } from "App/Providers/UIProvider";
import QUERY_ACHIEVEMENTS from "App/GraphQL/Queries/Achievements/List";
import MUTATE_DELETE_ACHIEVEMENT, {
  updateQueries
} from "App/GraphQL/Mutations/Achievements/Delete";

interface Props extends MutateProps {
  data: Query & ApolloQueryResult<Query> & { error: string };
  navigation: NavigationScreenProp<NavigationState>;
  type: "all" | "personal" | "suggested";
  ui: UIContext;
}

class Achievements extends React.PureComponent<Props> {
  deleteAchievement = (achievement: Achievement) => {
    this.props
      .mutate({
        variables: { id: achievement.id },
        // @ts-ignore
        updateQueries
      })
      .then(() =>
        this.props.ui
          .closeNotification()
          .then(() => this.props.ui.notifySuccess("Done"))
      );
  };

  confirmDelete = (achievement: Achievement) =>
    Alert.alert(`Delete ${achievement.name}`, "Are you sure?", [
      {
        text: "Cancel",
        onPress: () => null
      },
      {
        text: "Yes",
        onPress: () => this.deleteAchievement(achievement)
      }
    ]);

  render() {
    if (this.props.data.error) {
      return <Text>{this.props.data.error.toString()}</Text>;
    }

    const achievements = this.props.data.achievements;

    const { loading } = this.props.data;

    return loading ? (
      <View style={styles.background}>
        <View
          style={{ borderWidth: 1, borderRadius: 50, height: 100, width: 100 }}
        >
          <LottieView
            source={require("../../Lottie/hamster.json")}
            style={{ height: 100, width: 100 }}
            loop
            autoPlay
          />
        </View>
      </View>
    ) : (
      <Container>
        <Content>
          <FlatList
            data={achievements && achievements.edges ? achievements.edges : []}
            refreshing={this.props.data.loading}
            keyExtractor={({ node }) => (node ? node.id : "N/A")}
            renderItem={({ item }) => (
              <AchievementCard
                achievement={item.node}
                onEdit={() =>
                  item.node &&
                  this.props.navigation.navigate("EditScreen", {
                    id: item.node.id
                  })
                }
                onDelete={() => item.node && this.confirmDelete(item.node)}
                onPress={() =>
                  item.node &&
                  this.props.navigation.navigate("DetailsScreen", {
                    id: item.node.id
                  })
                }
              />
            )}
          />
        </Content>
      </Container>
    );
  }
}

const styles = EStyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF"
  }
});

const ListWithDefaultProps = (
  defaultProps: object = {}
): React.ComponentType<Props> => {
  const ListScreen: React.ComponentType<Props> = compose<Props, Props>(
    withProps(defaultProps),
    graphql(QUERY_ACHIEVEMENTS, {
      options: ({ type }: Props) => ({
        variables: { type }
      })
    }),
    graphql(MUTATE_DELETE_ACHIEVEMENT),
    withUIHelpers
  )(Achievements);

  return ListScreen;
};

export default {
  All: ListWithDefaultProps({ type: "all" }),
  Suggested: ListWithDefaultProps({ type: "suggested" }),
  Personal: ListWithDefaultProps({ type: "personal" })
};
