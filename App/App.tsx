import React from "react";
import { View, StatusBar } from "react-native";
import { Root } from "native-base";
import { PortalProvider, WhitePortal } from "react-native-portal";

// Providers
import OneSignal from "./Providers/OneSignalProvider";
import Rehydration from "./Providers/RehydrationProvider";
import CurrentUser from "./Providers/UserProvider";
import Web from "./Providers/WebProvider";
import Theme from "./Providers/ThemeProvider";
import UIProvider from "./Providers/UIProvider";

import Navigation from "./Config/Navigation";

// const stateLink = withClientState({ cache });

const RootContainer = () => (
  <Root>
    <Rehydration.Provider>
      <Theme.Provider>
        <OneSignal.Provider>
          <CurrentUser.Provider>
            <Web.Provider>
              <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" hidden />

                <PortalProvider>
                  <UIProvider.Provider>
                    <Navigation />
                    <WhitePortal name="outside" />
                    <WhitePortal name="dialog" />
                  </UIProvider.Provider>
                </PortalProvider>
              </View>
            </Web.Provider>
          </CurrentUser.Provider>
        </OneSignal.Provider>
      </Theme.Provider>
    </Rehydration.Provider>
  </Root>
);

export default RootContainer;
