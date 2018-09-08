import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";
import { ApolloQueryResult } from "apollo-client";
import { Container, Content, Text, Header } from "native-base";

import { Query } from "graphqlTypes";

import { NavigationScreenProp, NavigationState } from "react-navigation";
import LottieView from "lottie-react-native";
import AchievementCard from "../../Components/AchievementCard";

const ACHIEVEMENTS_QUERY = gql`
  query AchievementsList {
    achievements {
      edges {
        node {
          id
          name
          points
          icon

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
}

class Achievements extends React.PureComponent<Props> {
  render() {
    if (this.props.data.loading) {
      return <Text>Loading</Text>;
    }

    if (this.props.data.error) {
      return <Text>{this.props.data.error.toString()}</Text>;
    }

    return (
      <Container>
        <Content>
          <FlatList
            data={this.props.data.achievements.edges}
            keyExtractor={({ node }) => (node ? node.id : "N/A")}
            renderItem={({ item }) => (
              <AchievementCard
                achievement={item.node}
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

const Screen = compose(graphql(ACHIEVEMENTS_QUERY))(Achievements);

Screen.navigationOptions = ({ navigation }: Props) => ({
  headerRight: (
    <TouchableOpacity onPress={() => navigation.navigate("CreateScreen")}>
      <LottieView
        source={require("../../Lottie/add.json")}
        autoPlay
        loop
        style={{ height: 30, width: 30, marginRight: 10 }}
      />
    </TouchableOpacity>
  )
});

export default Screen;
