import Constants from "./Constants";

interface OAuthConsumerOptions {
  consumerKey: string;
  consumerSecret: string;
}

interface OAuthClientOptions {
  clientId: string;
  clientSecret: string;
}

export default {
  twitter: ({ consumerKey, consumerSecret }: OAuthConsumerOptions) => ({
    serviceConfiguration: {
      tokenEndpoint: "https://api.twitter.com/oauth/request_token",
      authorizationEndpoint: "https://api.twitter.com/oauth/authorize",
      access_token_url: "https://api.twitter.com/oauth/access_token"
    },
    consumerKey,
    consumerSecret
  }),
  facebook: ({ clientId, clientSecret }: OAuthClientOptions) => ({
    clientId,
    clientSecret,
    redirectUrl: `fb${clientId}://authorize`,
    serviceConfiguration: {
      authorizationEndpoint: "https://graph.facebook.com/oauth/authorize"
    }
  }),
  google: ({
    clientId
  }: Pick<
    OAuthClientOptions,
    keyof Exclude<OAuthClientOptions, "clientSecret">
  >) => ({
    issuer: "https://accounts.google.com",
    clientId: `${clientId}.apps.googleusercontent.com`,
    redirectUrl: `com.googleusercontent.apps.${clientId}:/oauth2redirect/google`,
    scopes: ["openid", "profile", "email"],
    audience: "achievements-app"
  })
};
