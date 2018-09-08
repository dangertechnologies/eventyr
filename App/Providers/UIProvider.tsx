import React from "react";

import { BlurView } from "react-native-blur";
import EStyleSheet from "react-native-extended-stylesheet";
import { Icon, H3 } from "native-base";
import { View as AnimatedView } from "react-native-animatable";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { tail } from "lodash";

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
  notify: (notification: Notification) => null
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
    if (this.state.notifications.length) {
      if (this.lottie) {
        this.lottie.play();
      }
      // Now fade the view out, pop the state, and
      // remove the ref

      if (this.overlay) {
        const duration: number = this.state.notifications[0].duration || 1200;

        setTimeout(() => {
          if (this.overlay && this.overlay.fadeOut) {
            const onClose = this.state.notifications[0].onClose;

            this.overlay.fadeOut().then(() =>
              this.setState(
                {
                  notifications: tail(this.state.notifications),
                  invisible: true
                },
                () => onClose && onClose()
              )
            );
          }
        }, duration);
      }
    }
  };

  componentWillReceiveProps(_: Props, nextState: State) {
    if (
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

  render(): JSX.Element {
    const contextValue: UIContext = {
      notify: this.notify,
      notifySuccess: this.notifySuccess,
      notifyError: this.notifyError
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
                      // @ts-ignore We know this exists. isLottie says so.
                      source={this.state.notifications[0].lottie}
                      style={{
                        width: 100,
                        height: 100
                      }}
                      loop={false}
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
    );
  }
}

export const withUIHelpers = <P extends object>(
  Component: React.ComponentType<P & { ui: UIContext }>
) =>
  class UIConsumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>
          {context => <Component {...props} {...this.props} ui={context} />}
        </Consumer>
      );
    }
  };

export default {
  Provider: UIProvider,
  Consumer
};
