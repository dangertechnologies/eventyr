import React from "react";

/** COMPONENTS **/
import { ScrollView, View, Animated } from "react-native";
import { Container, Content } from "native-base";
import UserHeader, { UserHeaderPlaceholder } from "./Header";
import UnlockedAchievements from "./Tabs/UnlockedList";
import UserAchievements from "./Tabs/AchievementList";
import MaterialTabs from "react-native-material-tabs";
import { View as AnimatedView } from "react-native-animatable";

/** UTILS */
import { compose, withProps, withState } from "recompose";
import { graphql } from "react-apollo";

/** TYPES **/
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { ApolloQueryResult } from "apollo-client";
import { Query, User } from "App/Types/GraphQL";
import { withUser, UserContext } from "App/Providers/UserProvider";

import EStyleSheet from "react-native-extended-stylesheet";

import QUERY_USER_DETAILS from "App/GraphQL/Users/Details";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

interface ComposedProps extends Props {
  currentUser: UserContext;
  scrollY: Animated.Value;
  data: Query & ApolloQueryResult<Query> & { error: string };
  headerHeight: Animated.AnimatedInterpolation;
  contentPadding: Animated.AnimatedInterpolation;
  selectedTab: number;
  setTab(number: any): any;
}

export const scrollRangeForAnimation = 300;

class ProfileScreen extends React.PureComponent<ComposedProps> {
  scrollView: ScrollView | null = null;

  onScrollEndSnapToEdge = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    if (0 < y && y < scrollRangeForAnimation / 2) {
      if (this.scrollView) {
        this.scrollView.scrollTo({ y: 100 });
      }
    } else if (
      scrollRangeForAnimation / 2 <= y &&
      y < scrollRangeForAnimation
    ) {
      if (this.scrollView) {
        this.scrollView.scrollTo({ y: scrollRangeForAnimation });
      }
    }
  };

  render() {
    const user: User = this.props.data.user;

    return (
      <View style={{ flex: 1, flexDirection: "column-reverse" }}>
        <Animated.ScrollView
          ref={(scrollView: any) => {
            this.scrollView = scrollView ? scrollView._component : null;
          }}
          onScrollEndDrag={this.onScrollEndSnapToEdge}
          onMomentumScrollEnd={this.onScrollEndSnapToEdge}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: this.props.scrollY }
              }
            }
          ])}
          scrollEventThrottle={16}
        >
          {UserHeaderPlaceholder}

          <Container>
            <Content style={styles.content}>
              {user &&
                this.props.selectedTab === 0 && (
                  <UnlockedAchievements user={user} />
                )}

              {user &&
                this.props.selectedTab === 1 && (
                  <UserAchievements user={user} />
                )}
            </Content>
          </Container>
        </Animated.ScrollView>
        <AnimatedView
          style={{
            position: "absolute",
            top: this.props.headerHeight,
            width: "100%",
            height: 50
          }}
        >
          <MaterialTabs
            items={["Unlocked", "Personal"]}
            selectedIndex={this.props.selectedTab}
            onChange={this.props.setTab}
            barColor={`${EStyleSheet.value("$colorSecondary")}`}
            indicatorColor="#fffe94"
            activeTextColor={`${EStyleSheet.value("$colorPrimary")}`}
          />
        </AnimatedView>
        <UserHeader
          user={this.props.data.user}
          height={this.props.headerHeight}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  content: {
    flexGrow: 1
  }
});

export default compose<ComposedProps, Props>(
  withUser,
  withProps(({ navigation, currentUser }: ComposedProps) => ({
    id: navigation.getParam("id", currentUser.id)
  })),
  graphql(QUERY_USER_DETAILS),
  withState("selectedTab", "setTab", 0),
  withState("scrollY", "setScrollY", new Animated.Value(0)),
  withProps(({ scrollY }: ComposedProps) => ({
    headerHeight: scrollY.interpolate({
      inputRange: [0, scrollRangeForAnimation],
      outputRange: [300, 100],
      extrapolate: "clamp"
    }),

    contentPadding: scrollY.interpolate({
      inputRange: [0, scrollRangeForAnimation],
      outputRange: [0, 100],
      extrapolate: "clamp"
    })
  }))
)(ProfileScreen);
