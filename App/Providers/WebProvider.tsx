import React from "react";
import { compose } from "recompose";
import {
  View,
  WebView,
  Platform,
  StyleSheet,
  Linking,
  TouchableWithoutFeedback
} from "react-native";
import * as Animated from "react-native-animatable";
// @ts-ignore
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { withTheme, ThemeContext } from "../Providers/ThemeProvider";

interface Props {
  ui: ThemeContext;
  children: React.ReactNode;
}

interface State {
  url: string;
  isVisible: boolean;
}

export interface WebContext {
  openUrl(url: string): any;
  url: string;
}

const styles = StyleSheet.create({
  webview: {
    position: "absolute",
    bottom: 0,
    // height: metrics.screenHeight - metrics.navBarHeight,
    // width: metrics.screenWidth,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    zIndex: 1000,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowOpacity: 0.5,
        shadowRadius: 5,
        // shadowColor: colors.shadowColor,
        shadowOffset: { height: -3, width: 0 }
      },
      android: {}
    })
  },

  popUpMenu: {
    // padding: metrics.baseMargin,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  webContent: {
    flex: 1
  }
});

const { Provider, Consumer } = React.createContext({
  url: "",
  openUrl: (url: string) => url
});

class WebProvider extends React.Component<Props, State> {
  state = {
    url: "https://github.com/facebook/react-native",
    isVisible: false
  };

  hide = () => this.webview && this.webview.transitionTo({ height: 0 });

  openUrl = (url: string) => {
    if (/^https/.test(url)) {
      this.setState({ url, isVisible: true }, () => {
        if (this.webview) {
          this.webview.transitionTo({
            // height: metrics.screenHeight - metrics.navBarHeight,
          });
        }
      });
    } else {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          this.props.ui.notify("Unencrypted URL", {
            type: "warning",
            buttonText: "OK",
            onClose: reason => reason === "user" && Linking.openURL(url)
          });
        } else {
          console.log(`Dont know how to open URI: ${url}`);
        }
      });
    }
  };

  hideIfOffscreen = (height: number) =>
    height === 0 && this.setState({ isVisible: false });

  yes = () => true;

  webview: Animated.View | null = null;

  render() {
    const contextValue: WebContext = {
      url: this.state.url,
      openUrl: this.openUrl
    };

    return (
      <Provider value={contextValue}>
        {this.props.children}

        {this.state.url &&
          this.state.isVisible && (
            <Animated.View
              ref={(node: any) => {
                this.webview = node;
              }}
              style={styles.webview}
              animation="slideInUp"
            >
              <View style={styles.popUpMenu}>
                <TouchableWithoutFeedback onPress={this.hide}>
                  <Icon name="chevron-down" color="#000000" size={25} />
                </TouchableWithoutFeedback>
              </View>

              <WebView
                source={{ uri: this.state.url }}
                style={styles.webContent}
              />
            </Animated.View>
          )}
      </Provider>
    );
  }
}

export const withWebView = <P extends object>(
  Component: React.ComponentType<P & { web: WebContext }>
) =>
  class WebViewConsumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>
          {context => <Component {...props} {...this.props} web={context} />}
        </Consumer>
      );
    }
  };

export default {
  Provider: compose<Props, {}>(withTheme)(WebProvider),
  Consumer
};
