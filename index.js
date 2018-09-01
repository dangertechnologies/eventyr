import { AppRegistry } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import themes from "./App/Themes";

EStyleSheet.build(themes.default);
import App from "./App/App";

AppRegistry.registerComponent("Eventyr", () => App);
