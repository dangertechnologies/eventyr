import React from "react";

/** COMPONENTS **/
import {
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData
} from "react-native";
import { Icon, Button, Text, Content, Input } from "native-base";
import LinearGradient from "react-native-linear-gradient";
import {
  Text as AnimatedText,
  View as AnimatedView
} from "react-native-animatable";

/** GraphQL */
import { graphql, MutateProps } from "react-apollo";
import MUTATE_AUTHENTICATE_USER, {
  updateQueries
} from "App/GraphQL/Mutations/Users/Authenticate";

/** UTILS */
import Config from "react-native-config";
import { compose } from "recompose";
import { authorize } from "react-native-app-auth";
import AuthConfig from "App/Config/AuthProviders";

/** TYPES **/
import { NavigationScreenProp, NavigationState } from "react-navigation";

import EStyleSheet from "react-native-extended-stylesheet";
import {
  RehydrationContext,
  withRehydratedState
} from "../../Providers/RehydrationProvider";

interface Props extends MutateProps {
  navigation: NavigationScreenProp<NavigationState>;
}

interface ComposedProps extends Props {
  rehydratedState: RehydrationContext;
}

class LoginScreen extends React.PureComponent<ComposedProps> {
  loginGoogle = async () => {
    const authState = await authorize(
      AuthConfig.google({ clientId: Config.GOOGLE_CLIENT_ID })
    );

    this.props
      .mutate({
        variables: { provider: "google", token: authState.idToken },
        // @ts-ignore We know it exists
        updateQueries
      })
      .then((result: any) => {
        if (
          result.data.authenticateUser &&
          result.data.authenticateUser.errors &&
          result.data.authenticateUser.errors.length
        ) {
          // FIXME: Handle errors here by showing a notification. Use UIProvider.
          console.log({
            name: "Login#error",
            value: result.data.authenticateUser.errors
          });
        } else {
          // Update credentials to log user in
          const { authenticateUser } = result.data;

          console.log({ authenticateUser });

          if (authenticateUser.user.authenticationToken) {
            this.props.rehydratedState.updateCredentials(
              authenticateUser.user.authenticationToken
            );

            this.props.navigation.navigate("Authorization");
          }
        }
      });
  };

  loginDemo = async (token: string) => {
    this.props
      .mutate({
        variables: { provider: "demo", token },
        // @ts-ignore
        updateQueries
      })
      .then((result: any) => {
        if (
          result.data.authenticateUser &&
          result.data.authenticateUser.errors &&
          result.data.authenticateUser.errors.length
        ) {
          // FIXME: Handle errors here by showing a notification. Use UIProvider.
          console.log({
            name: "Login#error",
            value: result.data.authenticateUser.errors
          });
        } else {
          // Update credentials to log user in
          const { authenticateUser } = result.data;

          console.log({ authenticateUser });

          if (authenticateUser.user.authenticationToken) {
            this.props.rehydratedState.updateCredentials(
              authenticateUser.user.authenticationToken
            );

            this.props.navigation.navigate("Authorization");
          }
        }
      });
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
              height: 200,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Input
              placeholder="Log in by code"
              style={{
                backgroundColor: "rgba(44,44,44,0.3)",
                width: 230,
                height: 50,
                paddingLeft: 20,
                color: "#FFFFFF",
                flex: 0,
                marginBottom: 50,
                borderRadius: 30
              }}
              onSubmitEditing={(
                e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
              ) => this.loginDemo(e.nativeEvent.text)}
            />

            <Button
              iconLeft
              rounded
              style={{ borderRadius: 20 }}
              full
              onPress={this.loginGoogle}
            >
              <Icon type="MaterialCommunityIcons" name="google" />
              <Text>Sign in with Google</Text>
            </Button>
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
    flex: 0.3,
    marginTop: -100
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly"
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
    backgroundColor: "$colorSecondary",
    transform: [{ rotate: -5 }],
    marginTop: -35
  },

  googleButton: {
    backgroundColor: "$colorSecondary"
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

const Enhanced = compose<ComposedProps, Props>(
  withRehydratedState,
  graphql(MUTATE_AUTHENTICATE_USER)
)(LoginScreen);

// @ts-ignore
Enhanced.navigationOptions = {
  headerTransparent: true
};

export default Enhanced;
