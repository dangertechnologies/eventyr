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
import UI from "./Providers/UIProvider";
import Unlock from "./Providers/UnlockProvider";

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
                  <UI.Provider>
                    <Unlock.Provider>
                      <Navigation />
                      <WhitePortal name="outside" />
                      <WhitePortal name="dialog" />
                    </Unlock.Provider>
                  </UI.Provider>
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
