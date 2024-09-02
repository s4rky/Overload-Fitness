import React, { useState, useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
import CreateWorkoutScreen from "./src/screens/CreateWorkoutScreen";
import { ThemeProvider } from "./src/screens/context/ThemeContext";
import WorkoutSessionScreen from "./src/screens/WorkoutSessionScreen";
import CustomSplitScreen from "./src/screens/CustomSplitScreen";
import LoginScreen from "./src/screens/LoginScreen"; // Import the new LoginScreen

const navigator = createStackNavigator(
  {
    Login: LoginScreen, // Add LoginScreen to the navigator
    Home: HomeScreen,
    CreateWorkout: CreateWorkoutScreen,
    WorkoutSession: WorkoutSessionScreen,
    CustomSplit: CustomSplitScreen,
  },
  {
    initialRouteName: "Login", // Set Login as the initial route
    defaultNavigationOptions: {
      title: "Overload",
    },
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
      <AppContainer />
    </ThemeProvider>
  );
};

export default App;
