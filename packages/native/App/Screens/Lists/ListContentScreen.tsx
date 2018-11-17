import React from "react";

/** PROVIDERS **/
import { withUIHelpers } from "App/Providers/UIProvider";

/** COMPONENTS **/
import { FlatList, Alert } from "react-native";
import { Container, Content, Text } from "native-base";
import AchievementCard from "App/Components/Cards/Achievement";
import Loading from "App/Components/Loading";

/** UTILS */
import { withProps, compose } from "recompose";

/** GRAPHQL **/
import { graphql } from "react-apollo";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

/** TYPES **/
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { Query, Achievement, List } from "@eventyr/graphql";
import { ApolloQueryResult } from "apollo-client";
import { MutateProps } from "react-apollo";
import { UIContext } from "App/Providers/UIProvider";
import QUERY_ACHIEVEMENTS from "@eventyr/graphql/Queries/Achievements/List";
import MUTATE_REMOVE_FROM_LIST, {
  updateQueries
} from "@eventyr/graphql/Mutations/Lists/RemoveFromList";
import withLocation, {
  LocationContext
} from "../../Providers/LocationProvider";

interface Props extends MutateProps {
  data: Query & ApolloQueryResult<Query> & { error: string };
  navigation: NavigationScreenProp<NavigationState>;
  list?: List;
  ui: UIContext;
  location: LocationContext;
}

class ListContentScreen extends React.PureComponent<Props> {
  removeFromList = (achievement: Achievement) => {
    this.props.list &&
      this.props
        .mutate({
          variables: {
            achievementIds: [achievement.id],
            listId: this.props.list.id
          },
          // @ts-ignore
          updateQueries
        })
        .then(() =>
          this.props.ui
            .closeNotification()
            .then(() => this.props.ui.notifySuccess("Removed"))
        );
  };

  confirmDelete = (achievement: Achievement) =>
    Alert.alert(`Remove Achievement`, "Are you sure?", [
      {
        text: "Cancel",
        onPress: () => null
      },
      {
        text: "Yes",
        onPress: () => {
          this.props.ui.notifyLoading({});
          this.removeFromList(achievement);
        }
      }
    ]);

  render() {
    if (this.props.data.error) {
      return <Text>{this.props.data.error.toString()}</Text>;
    }

    const achievements = this.props.data.achievements;

    const { loading } = this.props.data;

    return loading ? (
      <Loading />
    ) : (
      <Container style={styles.container}>
        <Content style={styles.content}>
          <FlatList
            data={achievements && achievements.edges ? achievements.edges : []}
            refreshing={this.props.data.loading}
            keyExtractor={({ node }) => (node ? node.id : "N/A")}
            renderItem={({ item }) => (
              <AchievementCard
                achievement={item.node}
                actions={
                  item &&
                  item.node &&
                  this.props.list &&
                  this.props.list.isEditable
                    ? [
                        {
                          label: "Remove from list",
                          destructive: true,
                          onPress: this.confirmDelete
                        }
                      ]
                    : undefined
                }
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
  container: {
    backgroundColor: "$colorBackground"
  },
  content: {
    paddingHorizontal: "$spacing",
    paddingTop: "$spacing"
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});

export default compose<Props, Props>(
  withProps(({ navigation }: Props) => ({
    list: navigation.getParam("list", null)
  })),
  withLocation(),
  graphql(QUERY_ACHIEVEMENTS, {
    options: ({ location, list }: Props) => ({
      variables: {
        listId: list && list.id,
        type: "all",
        coordinates:
          location && location.latitude && location.longitude
            ? [location.latitude, location.longitude]
            : null
      }
    })
  }),
  graphql(MUTATE_REMOVE_FROM_LIST),
  withUIHelpers
)(ListContentScreen);
