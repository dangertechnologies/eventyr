import { createMaterialTopTabNavigator } from "react-navigation";
import UserLists from "./UserLists";
import FollowedLists from "./FollowedLists";
export { HeaderAddButton } from "./HeaderAddButton";

export default createMaterialTopTabNavigator(
  {
    UserLists: {
      screen: UserLists,
      navigationOptions: { title: "Your lists" }
    },
    FollowedLists: {
      screen: FollowedLists,
      navigationOptions: { title: "Followed lists" }
    }
  },
  {
    swipeEnabled: false,
    tabBarOptions: {
      style: {
        backgroundColor: "#5cb85c"
      },
      indicatorStyle: {
        backgroundColor: "#FFD300"
      }
    }
  }
);
