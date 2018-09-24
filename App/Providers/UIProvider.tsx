import React from "react";
import getTheme from "App/Themes/NativeBase/components";
import nativeBaseTheme from "App/Themes/NativeBase/variables/platform";
import PushNotification, {
  PushNotificationObject
} from "react-native-push-notification";
import { BlurView } from "react-native-blur";
import EStyleSheet from "react-native-extended-stylesheet";
import { Icon, H3, StyleProvider } from "native-base";
import { View as AnimatedView } from "react-native-animatable";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { tail } from "lodash";

export interface Notification {
  message: string;
  icon?: {
    name: string;
    type: string;
  };
  lottie?: object;
  color?: string;
  duration?: number;
  confirmationText?: string;
  onConfirm?(): any;
  onCancel?(): any;
  onClose?(): any;
}

export interface UIContext {
  notifySuccess(text: string): any;
  notifyError(text: string): any;
  notify(notification: Notification): any;
  closeNotification(): any;
  notifyLoading(options: { onClose?(): any }): any;
  localPushNotification(options?: Partial<PushNotificationObject>): any;
}

interface Props {
  children: React.ReactNode;
}

interface State {
  notifications: Notification[];
  invisible: boolean;
}

const DEFAULT_CONTEXT: UIContext = {
  notifySuccess: (text: string) => text,
  notifyError: (text: string) => text,
  notify: (notification: Notification) => null,
  closeNotification: () => null,
  notifyLoading: () => null,
  localPushNotification: () => null
};

const { Provider, Consumer } = React.createContext(DEFAULT_CONTEXT);

class UIProvider extends React.Component<Props, State> {
  state: State = {
    notifications: [],
    invisible: true
  };

  overlay: AnimatedView | null = null;
  lottie: LottieView | null = null;

  onOverlayFaded = () => {
    if (this.state.notifications && this.state.notifications.length) {
      if (this.lottie) {
        this.lottie.play();
      }
      // Now fade the view out, pop the state, and
      // remove the ref

      if (this.overlay && this.state.notifications.length) {
        const duration: number | undefined = this.state.notifications[0]
          .duration;
        const onClose = this.state.notifications[0].onClose;

        console.log({ duration, notifications: this.state.notifications });

        if (duration !== -1) {
          setTimeout(
            () =>
              this.closeNotification().then(() => (onClose ? onClose() : null)),
            duration || 1200
          );
        }
      }
    }
  };

  closeNotification = () =>
    new Promise(resolve => {
      if (this.overlay && this.overlay.fadeOut) {
        const notification = this.state.notifications[0];

        console.log({ notification });

        this.overlay.fadeOut().then(() =>
          this.setState(
            {
              notifications: tail(this.state.notifications),
              invisible: true
            },
            resolve
          )
        );
      }
    });

  componentWillReceiveProps(_: Props, nextState: State) {
    if (
      nextState.notifications &&
      nextState.notifications.length &&
      this.state.invisible &&
      this.overlay &&
      this.overlay.fadeIn
    ) {
      this.overlay
        .fadeIn()
        .then(() => this.setState({ invisible: false }, this.onOverlayFaded));
    }
  }

  notify = (notification: Notification) =>
    this.overlay && this.overlay.fadeIn
      ? this.overlay.fadeIn().then(() =>
          this.setState(
            {
              notifications: this.state.notifications.concat([notification]),
              invisible: false
            },
            this.onOverlayFaded
          )
        )
      : this.setState({
          notifications: this.state.notifications.concat([notification])
        });

  notifyLoading = ({ onClose }: { onClose?(): any }) =>
    this.notify({
      message: "Hang on...",
      lottie: require("../Lottie/hamster.json"),
      duration: -1,
      onClose
    });

  notifySuccess = (text: string) =>
    new Promise(resolve =>
      this.notify({
        message: text,
        lottie: require("../Lottie/success.json"),
        duration: 800,
        onClose: resolve
      })
    );

  notifyError = (text: string) =>
    this.notify({
      message: text,
      lottie: require("../Lottie/success.json"),
      duration: 800
    });

  localPushNotification = (settings?: Partial<PushNotificationObject>) =>
    PushNotification.localNotification({
      /* Android Only Properties */
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
      subText: "This is a subText", // (optional) default: none
      color: "red", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000

      /* iOS only properties */
      alertAction: "view", // (optional) default: view

      /* iOS and Android properties */
      title: "My Notification Title", // (optional)
      message: "My Notification Message", // (required)
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
      ...(settings || {})
    });

  render(): JSX.Element {
    const contextValue: UIContext = {
      notify: this.notify,
      notifySuccess: this.notifySuccess,
      notifyError: this.notifyError,
      closeNotification: this.closeNotification,
      notifyLoading: this.notifyLoading,
      localPushNotification: this.localPushNotification
    };

    const isVisible: boolean = Boolean(this.state.notifications.length);
    const isLottie: boolean =
      isVisible && Boolean(this.state.notifications[0].lottie);
    const isIcon: boolean = Boolean(
      !isLottie &&
        isVisible &&
        this.state.notifications[0].icon &&
        // @ts-ignore
        this.state.notifications[0].icon.name
    );

    return (
      <StyleProvider style={getTheme(nativeBaseTheme())}>
        <Provider value={contextValue}>
          {this.props.children}

          <AnimatedView
            animation="fadeIn"
            style={styles.overlay}
            pointerEvents={!isVisible ? "none" : undefined}
            ref={(view: any) => {
              this.overlay = view;
            }}
            onAnimationEnd={this.onOverlayFaded}
          >
            {!isVisible ? null : (
              <BlurView blurType="light" blurAmount={30} style={styles.blur}>
                <React.Fragment>
                  <View style={styles.icon}>
                    {isLottie && (
                      <LottieView
                        ref={(lottie: any) => {
                          this.lottie = lottie;
                        }}
                        loop={this.state.notifications[0].duration === -1}
                        // @ts-ignore We know this exists. isLottie says so.
                        source={this.state.notifications[0].lottie}
                        style={{
                          width: 100,
                          height: 100
                        }}
                      />
                    )}

                    {isIcon && (
                      <Icon
                        // @ts-ignore We know this exists, isIcon says so.
                        name={this.state.notifications[0].icon.name}
                        style={{
                          color: "#AA0000",
                          fontSize: 100,
                          width: 100
                        }}
                      />
                    )}
                  </View>
                  <H3 style={styles.message}>
                    {this.state.notifications[0].message}
                  </H3>
                </React.Fragment>
              </BlurView>
            )}
          </AnimatedView>
        </Provider>
      </StyleProvider>
    );
  }
}

const styles = EStyleSheet.create({
  overlay: {
    position: "absolute",
    $size: "$screenWidth / 2",
    width: "$size",
    height: "$size * 1.25",
    left: "$screenWidth / 4",
    top: "$screenHeight / 3",
    borderRadius: "$borderRadius"
  },

  blur: {
    borderRadius: "$borderRadius",
    borderColor: "$borderColor",
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  icon: {
    alignItems: "center",
    justifyContent: "center"
  },

  message: {
    position: "absolute",
    color: "#333333",
    fontWeight: "bold",
    bottom: "10%"
  }
});

export const withUIHelpers = <P extends object>(
  Component: React.ComponentType<P & { ui: UIContext }>
) =>
  class UIConsumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>{context => <Component {...props} ui={context} />}</Consumer>
      );
    }
  };

export default {
  Provider: UIProvider,
  Consumer
};
