import React from "react";

import PropTypes from "prop-types";
import Auth0 from "react-native-auth0";
import {
  CreateUserResponse,
  PasswordRealmResponse,
  UserInfo
} from "react-native-auth0";
import Secrets from "react-native-config";
import decodeJWT from "jwt-decode";
import { now } from "lodash";

export const auth0 = new Auth0({
  // domain: Secrets.AUTH0_DOMAIN,
  // clientId: Secrets.AUTH0_CLIENT_ID
  domain: "something.com",
  clientId: "123"
});

export interface Credentials extends PasswordRealmResponse {
  expiryDate: number;
  refreshToken?: string | undefined;
}

interface RefreshTokenParams {
  refreshToken: string;
}

export interface Auth0Context {
  createUser: Function;
  resetPassword: Function;
  loginGoogle: Function;
  loginTwitter: Function;
  loginFacebook: Function;
  loginEmail: Function;
  refreshAuthToken(options: RefreshTokenParams): Promise<any>;
  userInfo: { [key: string]: any };
  credentials: Credentials;
}

export interface Auth0Error extends Error {
  json?: {
    description: string;
  };
}

export interface LoginSuccess {
  credentials: Credentials;
  userInfo: UserInfo | {};
  message?: string;
}

export interface CreateUserSuccess {
  credentials: CreateUserResponse;
  userInfo: UserInfo | {};
  message?: string;
}

export interface Props {
  children: React.ReactNode;
}

export interface State {
  userInfo: UserInfo | {};
  credentials: Credentials;
}

export const contextShape = {
  createUser: PropTypes.func,
  resetPassword: PropTypes.func,
  loginGoogle: PropTypes.func,
  loginTwitter: PropTypes.func,
  loginFacebook: PropTypes.func,
  loginEmail: PropTypes.func,
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    picture: PropTypes.string
  }),
  credentials: PropTypes.shape({
    expiresIn: PropTypes.number,
    accessToken: PropTypes.string,
    refreshToken: PropTypes.string
  })
};

export const DEFAULT_CREDENTIALS: Credentials = {
  expiresIn: 0,
  accessToken: "",
  refreshToken: "",
  expiryDate: 0,
  idToken: "",
  scope: "",
  tokenType: "Bearer"
};

const DEFAULT_CONTEXT: Auth0Context = {
  createUser: () => Promise.resolve({ message: "Not implemented" }),
  resetPassword: () => Promise.resolve({ message: "Not implemented" }),
  loginGoogle: () => Promise.resolve({ message: "Not implemented" }),
  loginTwitter: () => Promise.resolve({ message: "Not implemented" }),
  loginFacebook: () => Promise.resolve({ message: "Not implemented" }),
  loginEmail: () => Promise.resolve({ message: "Not implemented" }),
  refreshAuthToken: () => Promise.resolve("Not implemented"),
  userInfo: {},
  credentials: DEFAULT_CREDENTIALS
};

const { Provider, Consumer } = React.createContext(DEFAULT_CONTEXT);

class Auth0Provider extends React.Component<Props, State> {
  state: State = {
    credentials: DEFAULT_CREDENTIALS,
    userInfo: {}
  };

  createUser = (
    email: string,
    username: string,
    password: string
  ): Promise<CreateUserSuccess> =>
    new Promise(
      (resolve, reject) =>
        email && username && password
          ? auth0.auth
              .createUser({
                email,
                username,
                password,
                connection: "Username-Password-Authentication"
              })
              .then((credentials: CreateUserResponse) => {
                console.log({ credentials });
                console.log("Success", "New user created");

                resolve({
                  credentials,
                  message: "A confirmation link has been sent to your email",
                  userInfo: {}
                });
              })
              .catch(error => {
                console.log(error);
                console.log(`Error${error.json.description}`);
                reject(
                  new Error(
                    error.json ? error.json.description : "Registration failed"
                  )
                );
              })
          : reject(new Error("Email and password are required"))
    );

  resetPassword = (email: String): Promise<LoginSuccess> =>
    new Promise(
      (resolve, reject) =>
        email
          ? auth0.auth
              // @ts-ignore
              .resetPassword({
                email,
                connection: "Username-Password-Authentication"
              })
              .then((credentials: PasswordRealmResponse) => {
                const success: LoginSuccess = {
                  credentials: {
                    ...credentials,
                    expiryDate: now() / 1000 + credentials.expiresIn
                  },
                  message: "A password reset link has been sent to your email",
                  userInfo: {}
                };

                resolve(success);
              })
              .catch((error: Auth0Error) => {
                reject(
                  new Error(
                    error.json
                      ? error.json.description
                      : "Password reset failed"
                  )
                );
              })
          : reject(new Error("You need to provide an email"))
    );

  webAuth = (
    connection: "twitter" | "facebook" | "google"
  ): Promise<LoginSuccess> =>
    new Promise((resolve, reject) =>
      auth0.webAuth
        .authorize({
          scope: "openid profile email offline_access",
          connection,
          audience: "https://api.bitalert.io/"
        })
        .then(credentials => {
          if (credentials.expiresIn) {
            credentials.expiryDate = now() / 1000 + credentials.expiresIn;
          }

          try {
            const userInfo: UserInfo = decodeJWT(credentials.idToken);

            this.setState({ credentials, userInfo });
            resolve({
              credentials,
              userInfo,
              message: `Welcome back ${userInfo.name}`
            });
          } catch (error) {
            this.setState({ credentials, userInfo: {} });
            resolve({ credentials, userInfo: {} });
          }
        })
        .catch(error => {
          console.log({
            name: `webAuth#${connection}`,
            error
          });

          reject(new Error(error.error_description || "Authentication failed"));
        })
    );

  loginTwitter = (): Promise<LoginSuccess> => this.webAuth("twitter");
  loginFacebook = (): Promise<LoginSuccess> => this.webAuth("facebook");
  loginGoogle = (): Promise<LoginSuccess> => this.webAuth("google");

  loginEmail = (username: string, password: string): Promise<LoginSuccess> =>
    new Promise(
      (resolve, reject) =>
        username && password
          ? auth0.auth
              .passwordRealm({
                username,
                password,
                realm: "Username-Password-Authentication",
                scope: "openid profile email offline_access",
                audience: "https://api.bitalert.io/"
              })
              .then((credentials: PasswordRealmResponse) => {
                try {
                  const userInfo: UserInfo = decodeJWT(credentials.idToken);
                  const newCredentials = {
                    ...credentials,
                    expiryDate: now() / 1000 + credentials.expiresIn
                  };
                  const success: LoginSuccess = {
                    credentials: newCredentials,
                    message: `Welcome back ${userInfo.name}`,
                    userInfo
                  };

                  this.setState({ credentials: newCredentials, userInfo });
                  resolve(success);
                } catch (error) {
                  this.setState({
                    credentials: { ...credentials, expiryDate: 0 },
                    userInfo: {}
                  });
                  resolve({
                    credentials: { ...credentials, expiryDate: 0 },
                    userInfo: {}
                  });
                }
              })
              .catch(error => {
                console.log({ error: `Error${error.json.error_description}` });
                if (error.json.error_description) {
                  reject(
                    new Error(
                      error.json.error_description || "Authentication failed"
                    )
                  );
                }
              })
          : reject(new Error("Please fill out username and password"))
    );

  refreshAuthToken = ({ refreshToken }: { refreshToken: string }) =>
    auth0.auth
      .refreshToken({
        refreshToken,
        scope: "openid profile email offline_access"
      })
      .then(credentials => {
        if (credentials.expiresIn) {
          credentials.expiryDate = now() / 1000 + credentials.expiresIn;
        }
        try {
          const userInfo: UserInfo = decodeJWT(credentials.idToken);
          this.setState({ credentials, userInfo });
          return {
            credentials,
            userInfo,
            message: `Welcome back ${userInfo.name}`
          };
        } catch (error) {
          return null;
        }
      })
      .catch(credentials => {
        console.log({ credentials, refreshToken });
      });

  render() {
    const contextValue = {
      loginEmail: this.loginEmail,
      loginTwitter: this.loginTwitter,
      loginFacebook: this.loginFacebook,
      loginGoogle: this.loginGoogle,
      resetPassword: this.resetPassword,
      createUser: this.createUser,
      credentials: this.state.credentials,
      userInfo: this.state.userInfo,
      refreshAuthToken: this.refreshAuthToken
    };

    console.log({ provider: "Auth0", value: contextValue });

    return <Provider value={contextValue}>{this.props.children}</Provider>;
  }
}

export const withAuth0 = <P extends object>(
  Comp: React.ComponentType<P & { auth0: Auth0Context }>
) =>
  // eslint-disable-next-line
  class Auth0Consumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>{context => <Comp {...props} auth0={context} />}</Consumer>
      );
    }
  };

export default { Provider: Auth0Provider, Consumer };
