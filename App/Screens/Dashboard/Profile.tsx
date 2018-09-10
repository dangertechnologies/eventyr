import React from "react";

/** COMPONENTS **/
import { ScrollView, StyleSheet, View, FlatList } from "react-native";
import {
  Container,
  Header,
  Content,
  H1,
  H2,
  H3,
  Text,
  Icon,
  Left,
  Right,
  Body,
  Row
} from "native-base";
import { View as AnimatedView } from "react-native-animatable";
import UnlockedCard from "App/Components/Cards/Unlocked";

/** UTILS */
import { compose, withProps } from "recompose";
import { graphql } from "react-apollo";

/** TYPES **/
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { ApolloQueryResult } from "apollo-client";
import { Query } from "App/Types/GraphQL";
import { withUser, UserContext } from "App/Providers/UserProvider";

import EStyleSheet from "react-native-extended-stylesheet";

import QUERY_USER_DETAILS from "App/GraphQL/Users/Details";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

interface ComposedProps extends Props {
  currentUser: UserContext;
  data: Query & ApolloQueryResult<Query> & { error: string };
}

class ProfileScreen extends React.PureComponent<ComposedProps> {
  render() {
    console.log({ props: this.props });

    const { user } = this.props.data;
    return (
      <ScrollView>
        <Container>
          <AnimatedView style={styles.header} animation="bounceIn">
            <View style={styles.identity}>
              <AnimatedView style={styles.avatar} animation="bounceIn">
                <Icon
                  name="ios-person"
                  type="Ionicons"
                  style={styles.userIcon}
                />
              </AnimatedView>
              <H2 style={styles.name}>
                {this.props.data.user && this.props.data.user.name}
              </H2>
            </View>

            <Row style={styles.metadata}>
              <Left>
                <H3 style={styles.numbers}>130</H3>
                <Text note style={styles.pointsLabel}>
                  Unlocked
                </Text>
              </Left>
              <Body>
                <H2 style={styles.points}>
                  {this.props.data.user && this.props.data.user.points}
                </H2>
                <Text note style={styles.pointsLabel}>
                  Points
                </Text>
              </Body>
              <Right>
                <H3 style={styles.numbers}>22139</H3>
                <Text note style={styles.pointsLabel}>
                  Coop bonus
                </Text>
              </Right>
            </Row>
          </AnimatedView>
          <Content style={styles.content}>
            <H2>Recent activity</H2>
            <FlatList
              data={
                user && user.unlocked && user.unlocked.edges
                  ? user.unlocked.edges
                  : []
              }
              refreshing={this.props.data.loading}
              keyExtractor={({ node }) => (node ? node.id : "N/A")}
              renderItem={({ item }) => (
                <UnlockedCard
                  unlocked={item.node}
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
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  header: {
    height: "$screenHeight / 3",
    backgroundColor: "$colorSecondary",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "$borderColor",
    justifyContent: "center",
    alignItems: "center"
  },

  identity: {
    height: "80%",
    alignItems: "center",
    justifyContent: "flex-end"
  },

  avatar: {
    padding: "$spacing",
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "$colorPrimary",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center"
  },

  content: {
    flexGrow: 1,
    padding: "$spacing"
  },

  userIcon: {
    fontSize: 60,
    color: "#FFFFFF"
  },

  name: {
    color: "$colorPrimary",
    margin: "$spacing"
  },
  metadata: {
    margin: "$spacing"
  },

  numbers: {
    color: "$colorPrimary"
  },

  points: {
    color: "#00AA00"
  },

  pointsLabel: {
    textAlign: "left"
  }
});

export default compose<ComposedProps, Props>(
  withUser,
  withProps(({ navigation, currentUser }: ComposedProps) => ({
    id: navigation.getParam("id", currentUser.id)
  })),
  graphql(QUERY_USER_DETAILS)
)(ProfileScreen);
