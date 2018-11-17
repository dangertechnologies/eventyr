import { createStackNavigator } from "react-navigation";
import AchievementCreateScreen from "App/Screens/Achievements/Create";
import headerStyles from "../HeaderStyle";

const Routes = createStackNavigator({
  CreateScreen: {
    screen: AchievementCreateScreen,
    navigationOptions: {
      ...headerStyles,
      headerTintColor: "#FFFFFF",
      title: "Create"
    }
  }
});

export default Routes;
