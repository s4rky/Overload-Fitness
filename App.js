import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import CurrentDate from "./src/screens/CurrentDate";

const navigator = createStackNavigator(
  {
    Date: CurrentDate,
  },
  {
    initialRouteName: "Date",
    defaultNavigationOptions: {
      title: "Overload",
    },
  }
);

export default createAppContainer(navigator);
