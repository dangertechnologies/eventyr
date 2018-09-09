import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { ApolloQueryResult } from "apollo-client";
import { Container, Content, Text } from "native-base";

import { Query } from "graphqlTypes";

import { NavigationScreenProp, NavigationState } from "react-navigation";
import LottieView from "lottie-react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { withProps, compose } from "recompose";

import AchievementCard from "../../Components/AchievementCard";

const ACHIEVEMENTS_QUERY = gql`
  query AchievementsList($kind: String!) {
    achievements(kind: $kind) {
      edges {
        node {
          id
          name
          points
          icon

          author {
            id
            name
          }

          category {
            id
            title
            icon
          }
          mode {
            id
            name
          }
          type {
            id
            name
            icon
          }
        }
      }
    }
  }
`;

interface Props {
  data: Query & ApolloQueryResult<Query> & { error: string };
  navigation: NavigationScreenProp<NavigationState>;
  kind: "all" | "personal" | "tracked";
}

class Achievements extends React.PureComponent<Props> {
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
    graphql(ACHIEVEMENTS_QUERY, {
      options: ({ kind }: Props) => ({
        variables: { kind }
      })
    })
  )(Achievements);

  // @ts-ignore
  console.log(ListScreen);

  return ListScreen;
};

export default {
  All: ListWithDefaultProps({ kind: "all" }),
  Tracked: ListWithDefaultProps({ kind: "tracked" }),
  Personal: ListWithDefaultProps({ kind: "personal" })
};
