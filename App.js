import React, { useState, useEffect } from "react";
import { Appearance, useColorScheme, StatusBar, Alert } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { ThemeProvider } from "./src/screens/context/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

// Import your screens
import HomeScreen from "./src/screens/HomeScreen";
import CreateWorkoutScreen from "./src/screens/CreateWorkoutScreen";
import WorkoutSessionScreen from "./src/screens/WorkoutSessionScreen";
import CustomSplitScreen from "./src/screens/CustomSplitScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignUpScreen";

const navigator = createStackNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen,
    Home: HomeScreen,
    CreateWorkout: CreateWorkoutScreen,
    WorkoutSession: WorkoutSessionScreen,
    CustomSplit: CustomSplitScreen,
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: ({ navigation }) => ({
      title: "Overload",
      headerStyle: {
        backgroundColor: "#1a1a2e",
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
      },
      headerLeft: () =>
        navigation.state.routeName !== "Login" &&
        navigation.state.routeName !== "Signup" ? (
          <Icon
            name="menu-outline"
            size={25}
            color="#fff"
            style={{ marginLeft: 15 }}
            onPress={() =>
              Alert.alert("Menu", "Navigate to Home Screen?", [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => navigation.navigate("Home"),
                },
              ])
            }
          />
        ) : null,
      headerRight: () =>
        navigation.state.routeName === "Home" ? (
          <Icon
            name="add-outline"
            size={25}
            color="#fff"
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate("CreateWorkout")}
          />
        ) : null,
    }),
  }
);

const AppContainer = createAppContainer(navigator);

const App = () => {
  const scheme = useColorScheme();
  const [theme, setTheme] = useState(scheme);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  return (
    <ThemeProvider value={theme}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <AppContainer />
    </ThemeProvider>
  );
};

export default App;
