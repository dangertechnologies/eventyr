import React from "react";

/** COMPONENTS **/
import { ScrollView, View, Animated } from "react-native";
import { Container, Content } from "native-base";

import MaterialTabs from "react-native-material-tabs";
import { View as AnimatedView } from "react-native-animatable";

/** UTILS */
import { compose, withProps, withState } from "recompose";
import { graphql } from "react-apollo";
import color from "color";
import { isEqual } from "lodash";

/** TYPES **/
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { ApolloQueryResult } from "apollo-client";
import { Query, User } from "App/Types/GraphQL";
import { withUser, UserContext } from "App/Providers/UserProvider";

import EStyleSheet from "react-native-extended-stylesheet";

import UserHeader, {
  UserHeaderPlaceholder,
  HEADER_HEIGHT,
  HEADER_MIN_HEIGHT
} from "./Header";
import UnlockedAchievements from "./Tabs/UnlockedList";
import UserAchievements from "./Tabs/AchievementList";

import QUERY_USER_DETAILS from "App/GraphQL/Queries/Users/Details";

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

export const scrollRangeForAnimation = HEADER_HEIGHT;

class ProfileScreen extends React.PureComponent<ComposedProps> {
  static navigationOptions = {
    tabBarLabel: "Profile"
  };

  scrollView: ScrollView | null = null;

  componentDidMount() {
    this.setUserNavigationParams();
  }
  componentDidUpdate() {
    this.setUserNavigationParams();
  }

  private setUserNavigationParams = () => {
    const { currentUser, data } = this.props;
    const { user } = data;

    if (user && this.props.navigation.getParam("title") !== user.name) {
      this.props.navigation.setParams({
        title: user.name,
        avatar: user.avatar,
        isSelf: Boolean(
          currentUser && user && `${currentUser.id}` === `${user.id}`
        )
      });
    }
  };

  onScrollEndSnapToEdge = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    if (0 < y && y < scrollRangeForAnimation / 2) {
      if (this.scrollView) {
        this.scrollView.scrollTo({ y: 0 });
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

    console.log({ props: this.props });

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

          {user &&
            this.props.selectedTab === 1 && (
              <UnlockedAchievements user={user} />
            )}

          {user &&
            this.props.selectedTab === 0 && <UserAchievements user={user} />}
        </Animated.ScrollView>
        <AnimatedView
          // @ts-ignore
          style={{
            position: "absolute",
            top: this.props.headerHeight,
            width: "100%",
            height: 50
          }}
        >
          <MaterialTabs
            items={["Created", "Unlocked"]}
            selectedIndex={this.props.selectedTab}
            onChange={this.props.setTab}
            barColor={`${EStyleSheet.value("$colorPrimary")}`}
            indicatorColor={`${EStyleSheet.value("$colorPointsIcon")}`}
            inactiveTextColor={`${color(
              EStyleSheet.value("$colorSecondary")
            ).fade(0.5)}`}
            activeTextColor={`${EStyleSheet.value("$colorSecondary")}`}
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

const Enhanced = compose<ComposedProps, Props>(
  withUser,
  withProps(({ navigation, currentUser }: ComposedProps) => ({
    id: navigation.getParam("id", `${currentUser.id}`),
    title: currentUser.name
  })),
  graphql(QUERY_USER_DETAILS),
  withState("selectedTab", "setTab", 1),
  withState("scrollY", "setScrollY", new Animated.Value(0)),
  withProps(({ scrollY }: ComposedProps) => ({
    headerHeight: scrollY.interpolate({
      inputRange: [0, scrollRangeForAnimation],
      outputRange: [HEADER_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp"
    }),

    contentPadding: scrollY.interpolate({
      inputRange: [0, scrollRangeForAnimation],
      outputRange: [0, HEADER_MIN_HEIGHT],
      extrapolate: "clamp"
    })
  }))
)(ProfileScreen);

// @ts-ignore
Enhanced.navigationOptions = ProfileScreen.navigationOptions;

export default Enhanced;
