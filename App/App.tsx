import React from "react";
import { View, StatusBar } from "react-native";
import { Root } from "native-base";
import { PortalProvider, WhitePortal } from "react-native-portal";
import { Sentry } from "react-native-sentry";
Sentry.config(
  "https://c543dd7d43de4436acff3887eb457577@sentry.io/1314735"
).install();

// Providers
import OneSignal from "./Providers/OneSignalProvider";
import Rehydration from "./Providers/RehydrationProvider";
import CurrentUser from "./Providers/UserProvider";
import UI from "./Providers/UIProvider";
import Unlock from "./Providers/__deprecated_UnlockProvider";
import * as Location from "./Providers/LocationProvider";

import Navigation from "./Navigation/Router";

// const stateLink = withClientState({ cache });

const RootContainer = () => (
  <Root>
    <Rehydration.Provider>
      <OneSignal.Provider>
        <UI.Provider>
          <Location.Provider>
            <CurrentUser.Provider>
              <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" hidden />
                <PortalProvider>
                  <Unlock.Provider>
                    <Navigation />
                    <WhitePortal name="outside" />
                    <WhitePortal name="dialog" />
                  </Unlock.Provider>
                </PortalProvider>
              </View>
            </CurrentUser.Provider>
          </Location.Provider>
        </UI.Provider>
      </OneSignal.Provider>
    </Rehydration.Provider>
  </Root>
);

export default RootContainer;
