import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Animated,
  PanResponder
} from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import { BlurView } from "react-native-blur";

import EStyleSheet from "react-native-extended-stylesheet";
import { Icon } from "native-base";
import { BlackPortal } from "react-native-portal";

interface Props {
  children: React.ReactNode;
  snapTo: Array<string | number>;
  initialSnapIndex: number;
  avoidKeyboard: boolean;
  backgroundColor?: string;
}

interface State {
  visibleKeyboardHeight: 0;
}

const { height: screenHeight } = Dimensions.get("window");

class Drawer extends React.Component<Props, State> {
  static defaultProps = {
    avoidKeyboard: true,
    snapTo: [100, "40%", "90%"],
    initialSnapIndex: 1
  };

  state: State = {
    visibleKeyboardHeight: 0
  };

  private _keyboardWillShowSubscription: any | null = null;
  private _keyboardWillHideSubscription: any | null = null;
  private fingerPosition = new Animated.Value(screenHeight);

  private snapToHeight = (height: number) =>
    Animated.timing(this.fingerPosition, {
      toValue: screenHeight - height
    }).start();

  /**
   * Calculates the real height from a string (or a number). If e.g 50% is
   * given, then return what 50% of the current screenHeight would be as a
   * number
   */
  private absoluteHeightFromSnapValue = (value: number | string): number => {
    if (typeof value === "string") {
      if (/%/.test(value)) {
        return (parseInt(value.replace("%", ""), 10) / 100) * screenHeight;
      } else {
        return parseInt(value, 10);
      }
    }
    return value;
  };

  /**
   * Find which height to snap to by calculating which height
   * would have the closest position to the finger position
   */
  private snapToClosest = (fingerPosition: number) => {
    // Drawer snaps to positions depending on the given props.
    // Positions can either be given as percentage, or as numbers.

    // Calculate snap positions as numbers:
    const snapTo: Array<number | string> = this.props.snapTo;
    const snapHeights: Array<number> = snapTo.map(
      this.absoluteHeightFromSnapValue
    );

    // Sort heights by order of distance to the finger
    const closestHeight = snapHeights.sort(
      (a: number, b: number) =>
        Math.abs(fingerPosition - (screenHeight - a)) -
        Math.abs(fingerPosition - (screenHeight - b))
    )[0];

    this.snapToHeight(closestHeight);
  };

  private panResponder = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderTerminationRequest: (evt, gestureState) => true,

    // Sets this.fingerPosition to where the finger
    // is positioned while dragging
    onPanResponderMove: Animated.event([
      {
        nativeEvent: {
          pageY: this.fingerPosition
        }
      }
    ]),

    onPanResponderRelease: evt => this.snapToClosest(evt.nativeEvent.pageY),
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
    }
  });

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
    if (
      this.props.initialSnapIndex !== undefined &&
      this.props.snapTo.length > this.props.initialSnapIndex
    ) {
      this.snapToHeight(
        this.absoluteHeightFromSnapValue(
          this.props.snapTo[this.props.initialSnapIndex]
        )
      );
    }
  }

  keyboardWillShow = (e: any) => {
    this.setState({ visibleKeyboardHeight: e.endCoordinates.height });
  };

  keyboardWillHide = (e: any) =>
    this.props.avoidKeyboard && this.setState({ visibleKeyboardHeight: 0 });

  render() {
    const height = this.fingerPosition.interpolate({
      inputRange: [0, screenHeight],
      outputRange: [screenHeight, this.state.visibleKeyboardHeight],
      extrapolate: "clamp"
    });

    return (
      <BlackPortal name="outside">
        <AnimatedView
          style={[
            styles.outerContainer,
            {
              height,
              backgroundColor: "white"
            }
          ]}
        >
          <View style={styles.shadow}>
            <BlurView blurType="light" style={styles.blurContainer}>
              <View style={[styles.transparent, styles.content]}>
                <View
                  style={styles.dragHandleContainer}
                  {...this.panResponder.panHandlers}
                >
                  <TouchableOpacity style={{ height: 20 }}>
                    <Icon
                      name={"drag-handle"}
                      fontSize={20}
                      type="MaterialIcons"
                    />
                  </TouchableOpacity>
                </View>
                <View style={[styles.transparent, { flexGrow: 1 }]}>
                  {this.props.children}
                </View>
              </View>
            </BlurView>
          </View>
        </AnimatedView>
      </BlackPortal>
    );
  }
}

const styles = EStyleSheet.create({
  blurContainer: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 20
  },

  shadow: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 1.0,
    flex: 1,
    borderRadius: 20
  },

  outerContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderRadius: 20
  },
  transparent: { backgroundColor: "transparent" },
  content: {
    flex: 1,
    paddingTop: "$spacing / 2",
    borderTopLeftRadius: "$borderRadius",
    borderTopRightRadius: "$borderRadius"
  },

  dragHandleContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 20
  }
});

export default Drawer;
