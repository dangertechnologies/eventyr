import React from "react";
import { View, StatusBar } from "react-native";
import { Root } from "native-base";
import { PortalProvider, WhitePortal } from "react-native-portal";

// Providers
import AuthorizedFetch from "./Providers/FetchProvider";
import OneSignal from "./Providers/OneSignalProvider";
import Cache from "./Providers/CacheProvider";
import ApolloProvider from "./Providers/GraphQLProvider";
import Auth0 from "./Providers/Auth0Provider";
import CurrentUser from "./Providers/UserProvider";
import Web from "./Providers/WebProvider";
import Theme from "./Providers/ThemeProvider";
import UIProvider from "./Providers/UIProvider";

import Navigation from "./Config/Navigation";

// const stateLink = withClientState({ cache });

const RootContainer = () => (
  <Root>
    <Auth0.Provider>
      <Cache.Provider>
        <Theme.Provider>
          <AuthorizedFetch.Provider>
            <ApolloProvider>
              <OneSignal.Provider>
                <CurrentUser.Provider>
                  <Web.Provider>
                    <View style={{ flex: 1 }}>
                      <StatusBar barStyle="light-content" hidden />

                      <PortalProvider>
                        <UIProvider.Provider>
                          <Navigation />
                          <WhitePortal name="outside" />
                        </UIProvider.Provider>
                      </PortalProvider>
                    </View>
                  </Web.Provider>
                </CurrentUser.Provider>
              </OneSignal.Provider>
            </ApolloProvider>
          </AuthorizedFetch.Provider>
        </Theme.Provider>
      </Cache.Provider>
    </Auth0.Provider>
  </Root>
);

export default RootContainer;
