import React, { useState, useEffect } from "react";
import { Appearance, useColorScheme, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./src/screens/context/ThemeContext";
import { WorkoutPlanProvider } from "./src/screens/components/WorkoutPlanContext";
import DrawerNavigator from "./DrawerNavigator";

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
      <WorkoutPlanProvider>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </WorkoutPlanProvider>
    </ThemeProvider>
  );
};

export default App;
