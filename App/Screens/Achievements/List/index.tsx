import { createMaterialTopTabNavigator } from "react-navigation";
import Browse from "./BrowseTab";
import Community from "./CommunityTab";

export default createMaterialTopTabNavigator(
  {
    Browse,
    Community
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
