import React from "react";
import { View, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import { BlurView } from "react-native-blur";

import EStyleSheet from "react-native-extended-stylesheet";
import { Icon } from "native-base";
import { BlackPortal } from "react-native-portal";

interface Props {
  children: React.ReactNode;
  maxHeight: number;
  minHeight: number;
  position: "top" | "bottom";
  initiallyExpanded: boolean;
  avoidKeyboard: boolean;
}

interface State {
  expanded: boolean;
}

class Drawer extends React.Component<Props, State> {
  static defaultProps = {
    position: "bottom",
    initiallyExpanded: false,
    minHeight: 126,
    maxHeight: 350,
    avoidKeyboard: true
  };

  state: State = {
    expanded: false
  };

  private _keyboardWillShowSubscription: any | null = null;
  private _keyboardWillHideSubscription: any | null = null;

  componentWillMount() {
    this._keyboardWillShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardWillShow
    );
    this._keyboardWillHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    if (this._keyboardWillHideSubscription) {
      this._keyboardWillHideSubscription.remove();
    }

    if (this._keyboardWillShowSubscription) {
      this._keyboardWillShowSubscription.remove();
    }
  }

  componentDidMount() {
    if (this.props.initiallyExpanded) {
      this.setState({ expanded: true }, this.onExpand);
    }
  }

  keyboardWillShow = (e: any) =>
    this.props.position === "bottom" &&
    this.props.avoidKeyboard &&
    this.drawer &&
    this.drawer.transitionTo({ bottom: e.endCoordinates.height });

  keyboardWillHide = (e: any) =>
    this.props.position === "bottom" &&
    this.props.avoidKeyboard &&
    this.drawer &&
    this.drawer.transitionTo({ bottom: 0 });

  onExpand = () => {
    if (!this.drawer) {
      console.log("Drawer undefined?");
    } else {
      if (this.content) {
        this.content.measure((ox, oy, width, height) => {
          console.log({ height });
          if (this.drawer) {
            this.drawer.transitionTo({
              height:
                height + 60 > this.props.maxHeight
                  ? this.props.maxHeight
                  : height + 60
            });
          }
        });
      } else {
        this.drawer.transitionTo({ height: this.props.maxHeight });
      }
    }

    this.setState({ expanded: true });
  };

  onMinimize = () => {
    if (this.drawer) {
      this.drawer.transitionTo({ height: this.props.minHeight });
    }
    this.setState({ expanded: false });
  };

  drawer: AnimatedView | null = null;
  content: View | null = null;

  render() {
    const { position } = this.props;
    const { expanded } = this.state;

    return (
      <BlackPortal name="outside">
        <AnimatedView
          style={position === "top" ? styles.drawerTop : styles.drawerBottom}
          animation={position === "top" ? "slideInDown" : "slideInUp"}
          duration={1000}
          ref={(instance: any) => {
            this.drawer = instance as AnimatedView;
          }}
        >
          <BlurView blurType="light" style={{ flex: 1 }}>
            <View style={[styles.transparent, styles.drawer]}>
              {position === "top" && (
                <View
                  style={[styles.transparent, { flexGrow: 1 }]}
                  ref={(content: any) => {
                    this.content = content;
                  }}
                >
                  {this.props.children}
                </View>
              )}

              <View style={styles.expansionContainer}>
                <TouchableOpacity
                  onPress={expanded ? this.onMinimize : this.onExpand}
                  style={{ height: 20 }}
                >
                  <Icon
                    name={
                      (expanded && position === "bottom") ||
                      (!expanded && position === "top")
                        ? "chevron-down"
                        : "chevron-up"
                    }
                    fontSize={20}
                    type="MaterialCommunityIcons"
                  />
                </TouchableOpacity>
              </View>
              {position === "bottom" && (
                <View
                  style={[styles.transparent, { flexGrow: 1 }]}
                  ref={(content: any) => {
                    this.content = content;
                  }}
                >
                  {this.props.children}
                </View>
              )}
            </View>
          </BlurView>
        </AnimatedView>
      </BlackPortal>
    );
  }
}

const styles = EStyleSheet.create({
  drawerTop: {
    height: 129,
    width: "100%",
    borderColor: "$borderColor",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomLeftRadius: "$borderRadius",
    borderBottomRightRadius: "$borderRadius",
    position: "absolute",
    top: 0
  },

  drawerBottom: {
    height: 129,
    width: "100%",
    borderColor: "$borderColor",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: "$borderRadius",
    borderTopRightRadius: "$borderRadius",
    position: "absolute",
    bottom: 0
  },
  transparent: { backgroundColor: "transparent" },
  drawer: { flex: 1, paddingTop: "$spacing / 2" },

  expansionContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 20
  },

  scrolledContentContainer: {
    flexGrow: 1
  },

  scrolledContent: {
    flex: 1
  }
});

export default Drawer;
