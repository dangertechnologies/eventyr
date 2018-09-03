import React from "react";
import { View, FlatList } from "react-native";
import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";
import { ApolloQueryResult } from "apollo-client";
import { Container, Content, Text, Header } from "native-base";

import { Query } from "../../Types/graphqlTypes";

import AchievementCard from "../../Components/AchievementCard";

const ACHIEVEMENTS_QUERY = gql`
  query {
    achievements {
      edges {
        node {
          id
          name
          points
          icon

          category {
            title
            icon
          }
          mode {
            name
            icon
          }
          type {
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
}

class Achievements extends React.PureComponent<Props> {
  static navigationOptions = {
    title: "Achievements"
  };

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
              <AchievementCard achievement={item.node} />
            )}
          />
        </Content>
      </Container>
    );
  }
}

export default compose(graphql(ACHIEVEMENTS_QUERY))(Achievements);
