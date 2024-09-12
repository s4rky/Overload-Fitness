import React, { useState, useEffect } from "react";
import {
  Appearance,
  useColorScheme,
  StatusBar,
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ThemeProvider } from "./src/screens/context/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";

// Import your screens
import HomeScreen from "../HomeScreen";
import CreateWorkoutScreen from "../CreateWorkoutScreen";
import WorkoutSessionScreen from "../WorkoutSessionScreen";
import CustomSplitScreen from "../CustomSplitScreen";
import LoginScreen from "../LoginScreen";
import SignupScreen from "../SignUpScreen";

const MainStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={({ navigation, route }) => ({
      headerStyle: {
        backgroundColor: "#1a1a2e",
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
      },
      headerLeft: () => {
        if (route.name !== "Login" && route.name !== "Signup") {
          return (
            <Icon
              name="menu-outline"
              size={25}
              color="#fff"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.toggleDrawer()}
            />
          );
        }
        return null;
      },
      headerRight: () => {
        if (route.name === "Home") {
          return (
            <Icon
              name="add-outline"
              size={30}
              color="#007AFF"
              style={{ marginRight: 15 }}
              onPress={() => showAddOptions(navigation)}
            />
          );
        }
        return null;
      },
    })}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
    <Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} />
    <Stack.Screen name="CustomSplit" component={CustomSplitScreen} />
  </Stack.Navigator>
);

export default MainStack;
