import React from "react";
import { View, StatusBar } from "react-native";
import { Root } from "native-base";
import { PortalProvider, WhitePortal } from "react-native-portal";
import { Sentry } from "react-native-sentry";

if (!__DEV__) {
  Sentry.config(
    "https://c543dd7d43de4436acff3887eb457577@sentry.io/1314735"
  ).install();
}

import { RehydrationProvider, UserProvider } from "@eventyr/core/Providers";
import { CurrentUser, Notification } from "@eventyr/graphql";

import PushNotification from "react-native-push-notification";
// @ts-ignore
import fsStorage from "redux-persist-fs-storage";
// Providers
import OneSignal from "./Providers/OneSignalProvider";

import UI from "./Providers/UIProvider";
import Unlock from "./Providers/UnlockProvider";
import * as Location from "./Providers/LocationProvider";

import Navigation from "./Navigation/Router";

import notificationTitle from "./Helpers/notificationTitle";

const RootContainer = () => (
  <Root>
    <RehydrationProvider storage={fsStorage()}>
      <OneSignal.Provider>
        <UI.Provider>
          <Location.Provider>
            <UserProvider
              onUserFetched={(user: CurrentUser) =>
                Sentry.setUserContext({
                  email: user.email,
                  username: user.name,
                  id: user.id
                })
              }
              onNotificationReceived={(notification: Notification) => {
                PushNotification.localNotification({
                  vibrate: true, // (optional) default: true
                  vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000

                  /* iOS only properties */
                  ...notificationTitle(notification)
                });
              }}
            >
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
            </UserProvider>
          </Location.Provider>
        </UI.Provider>
      </OneSignal.Provider>
    </RehydrationProvider>
  </Root>
);

export default RootContainer;
