import React from "react";

/** Providers */
import {
  RehydrationContext,
  withRehydratedState
} from "@eventyr/core/Providers";

/** COMPONENTS **/
import { StyleSheet } from "react-native";
import { Content } from "native-base";
import LinearGradient from "react-native-linear-gradient";
import {
  Text as AnimatedText,
  View as AnimatedView
} from "react-native-animatable";
import LottieView from "lottie-react-native";

/** GraphQL */
import MUTATE_AUTHENTICATE_USER, {
  updateQueries
} from "@eventyr/graphql/Mutations/Users/Authenticate";

/** UTILS */
import { compose } from "recompose";

/** TYPES **/
import { NavigationScreenProp, NavigationState } from "react-navigation";

import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

interface ComposedProps extends Props {
  rehydratedState: RehydrationContext;
}

class AuthorizationScreen extends React.PureComponent<ComposedProps> {
  delayedCheck: any = null;

  componentDidMount() {
    if (!this.delayedCheck) {
      this.delayedCheck = setTimeout(this.routeUser, 500);
    }
  }

  routeUser = () => {
    this.delayedCheck = clearTimeout(this.delayedCheck);
    if (!this.props.rehydratedState.restored) {
      this.delayedCheck = setTimeout(this.routeUser, 500);
      return;
    }

    this.props.navigation.navigate(
      this.props.rehydratedState.isLoggedIn ? "LoggedIn" : "LoggedOut"
    );
  };

  render() {
    return (
      <LinearGradient
        // colors={["#7F00FF", "#CD1F7D"]}
        colors={[
          EStyleSheet.value("$colorPrimary"),
          EStyleSheet.value("$colorPrimaryLight")
        ]}
        start={{ x: 0.8, y: 0.1 }}
        end={{ x: 0.1, y: 0.8 }}
        style={styles.container}
      >
        <Content
          style={styles.contentContainer}
          contentContainerStyle={styles.content}
        >
          <AnimatedView style={styles.titleContainer}>
            <AnimatedView
              animation="slideInLeft"
              style={styles.underline}
              delay={1500}
              duration={1500}
            />
            <AnimatedText
              animation="fadeIn"
              style={styles.title}
              duration={1500}
            >
              Æventyr
            </AnimatedText>
          </AnimatedView>

          <AnimatedView
            style={{
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 50,
              height: 100,
              width: 100
            }}
            animation="bounceIn"
          >
            <LottieView
              source={require("../../Lottie/hamster.json")}
              style={{ height: 100, width: 100 }}
              loop
              autoPlay
            />
          </AnimatedView>
        </Content>
      </LinearGradient>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  contentContainer: {
    flex: 0.2,
    marginTop: -100
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  titleContainer: {
    flexDirection: "column-reverse",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-5deg" }]
  },

  underline: {
    width: 250,
    height: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomColor: "$colorSecondary",
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: -5 }],
    marginTop: -35
  },

  title: {
    fontFamily: "Italianno",
    color: "$colorSecondary",
    fontWeight: "bold",
    fontSize: 100,
    lineHeight: 100,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: {
      width: StyleSheet.hairlineWidth,
      height: StyleSheet.hairlineWidth
    },
    textShadowRadius: 2
  }
});

const Enhanced = compose<ComposedProps, Props>(withRehydratedState)(
  AuthorizationScreen
);

// @ts-ignore
Enhanced.navigationOptions = {
  headerTransparent: true
};

export default Enhanced;
