// @flow

import React from "react";
import PropTypes from "prop-types";
import OneSignal from "react-native-onesignal";
import { OpenResult, ReceivedNotification } from "react-native-onesignal";
import Secrets from "react-native-config";

interface OneSignalDevice {
  userId: string;
  pushToken: string;
}

interface State {
  device: OneSignalDevice;
}

interface Props {
  children: React.ReactNode;
}

export interface OneSignalContext extends State {}

OneSignal.init(Secrets.ONESIGNAL_APP_ID);

export const contextShape = {
  device: PropTypes.shape({
    userId: PropTypes.string,
    pushToken: PropTypes.string
  })
};

const { Provider, Consumer } = React.createContext({
  device: { userId: "", pushToken: "" }
});

class OneSignalProvider extends React.Component<Props, State> {
  state: State = {
    device: {
      userId: "",
      pushToken: ""
    }
  };

  componentDidMount() {
    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener("ids", this.onIds);
    console.debug({ name: "OneSignal#Setup " });
    OneSignal.registerForPushNotifications();
    OneSignal.inFocusDisplaying(2);
  }

  componentWillUnmount() {
    // OneSignal.removeEventListener('received', this.onReceived);
    // OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  onReceived = (notification: ReceivedNotification) => {
    console.log("Notification received: ", notification);
  };

  onOpened = (openResult: OpenResult) => {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  };

  onIds = (device: OneSignalDevice) => this.setState({ device });

  render() {
    const contextValue: OneSignalContext = {
      ...this.state
    };
    console.log({ provider: "OneSignal", value: contextValue });
    return <Provider value={contextValue}>{this.props.children}</Provider>;
  }
}

/*
export const withOneSignal = (
  Component: ComponentType<*>,
): ComponentType<*> => props => (
  <Consumer>
    {oneSignal => <Component {...props} oneSignal={oneSignal} />}
  </Consumer>
);
*/
export const withOneSignal = <P extends object>(
  Component: React.ComponentType<P & { oneSignal: OneSignalContext }>
) =>
  class OneSignalConsumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>
          {context => <Component {...props} oneSignal={context} />}
        </Consumer>
      );
    }
  };

export { Consumer };
export default { Provider: OneSignalProvider, Consumer };
