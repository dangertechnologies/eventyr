import React from "react";

/** COMPONENTS **/
import { View } from "react-native";
import LottieView from "lottie-react-native";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

/**
 * Simple loading component showing the hamster, to be
 * used in any components that need to render loading state
 */
class Loading extends React.PureComponent {
  render() {
    return (
      <View style={styles.background}>
        <View
          style={{ borderWidth: 1, borderRadius: 50, height: 100, width: 100 }}
        >
          <LottieView
            source={require("../Lottie/hamster.json")}
            style={{ height: 100, width: 100 }}
            loop
            autoPlay
          />
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});

export default Loading;
