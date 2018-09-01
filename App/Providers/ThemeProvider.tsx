import React from "react";
import { Toast } from "native-base";
// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";
import themes from "../Themes";

interface Props {
  children: React.ReactNode;
}

interface State {
  theme: string;
}

export interface NotificationOptions {
  buttonText?: string;
  duration?: number;
  type: "danger" | "success" | "warning" | undefined;
  onClose?(reason: string): any;
}

export interface ThemeContext extends State {
  notify(message: string, options?: NotificationOptions): any;
  notifySuccess(message: string, options?: NotificationOptions): any;
  notifyError(message: string, options?: NotificationOptions): any;
}

const { Provider, Consumer } = React.createContext({
  notify: (message: string, options?: NotificationOptions) => null,
  notifySuccess: (message: string, options?: NotificationOptions) => null,
  notifyError: (message: string, options?: NotificationOptions) => null,
  theme: "default"
});

class ThemeProvider extends React.Component<Props, State> {
  state = {
    theme: "light"
  };

  notifySuccess = (message: string): void => {
    this.notify(message, { type: "success", duration: 1250 });
  };

  notifyError = (message: string): void => {
    this.notify(message, { type: "danger", duration: 2500 });
  };

  notify = (message: string, options: NotificationOptions): void => {
    Toast.show({
      ...options,
      text: message,
      position: "bottom"
    });
  };

  componentWillMount() {
    EStyleSheet.build(themes.default);
  }

  componentWillReceiveProps(_: Props, state: State) {
    if (state.theme !== this.state.theme) {
      EStyleSheet.build(themes[this.state.theme]);
    }
  }

  render() {
    const contextValue: ThemeContext = {
      theme: this.state.theme,
      notify: this.notify,
      notifyError: this.notifyError,
      notifySuccess: this.notifySuccess
    };

    return <Provider value={contextValue}>{this.props.children}</Provider>;
  }
}

export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { ui: ThemeContext }>
) =>
  class ThemeConsumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>{context => <Component {...props} ui={context} />}</Consumer>
      );
    }
  };

export default {
  Provider: ThemeProvider,
  Consumer
};
