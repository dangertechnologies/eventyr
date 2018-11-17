import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const CreateButton = () => (
  <View style={styles.container}>
    <LottieView
      source={require("../Lottie/add.white.json")}
      autoPlay
      loop
      style={{ height: 70, width: 70 }}
    />
  </View>
);

const styles = EStyleSheet.create({
  container: {
    $halfScreen: "$screenWidth / 2",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    // position: "absolute",
    // left: "$halfScreen - 35",
    // bottom: 50,
    borderWidth: 3,
    backgroundColor: "$colorAccent",
    borderColor: "#FFFFFF"
  }
});
export default CreateButton;
