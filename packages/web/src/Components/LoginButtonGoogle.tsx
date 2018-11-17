import React from "react";
import { AuthProviders } from "@eventyr/core";
import { graphql, MutationFn } from "react-apollo";
import MUTATE_AUTHENTICATE_USER, {
  updateQueries
} from "@eventyr/graphql/Mutations/Users/Authenticate";

/** UTILS */
import { compose } from "recompose";

/** TYPES **/
import {
  RehydrationContext,
  withRehydratedState
} from "@eventyr/core/Providers/RehydratedState";
import { withRouter } from "react-router";
import { Button } from "@material-ui/core";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline
} from "react-google-login";

interface ComposedProps {
  rehydratedState: RehydrationContext;
  mutate: MutationFn;
}

class GoogleButton extends React.Component<ComposedProps> {
  onLogin = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    const authResponse = await (response as GoogleLoginResponse).getAuthResponse();

    this.props
      .mutate({
        variables: { provider: "google", token: authResponse.id_token },
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
          }
        }
      });
  };

  onFailure = (e: Error) => console.error("Something went wrong", e);

  render() {
    return (
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID as string}
        render={(props: any) => (
          <Button variant="raised" color="primary" onClick={props.onClick}>
            Login with Google
          </Button>
        )}
        buttonText="Login"
        accessType="offline"
        scope={"openid profile email"}
        onSuccess={this.onLogin}
        onFailure={this.onFailure}
      />
    );
  }
}

export default compose<ComposedProps, {}>(
  graphql(MUTATE_AUTHENTICATE_USER),
  withRehydratedState,
  withRouter
)(GoogleButton);
