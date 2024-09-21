import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Import your screens
import HomeScreen from "./src/screens/HomeScreen";
import CreateWorkoutScreen from "./src/screens/CreateWorkoutScreen";
import WorkoutSessionScreen from "./src/screens/WorkoutSessionScreen";
import CustomSplitScreen from "./src/screens/CustomSplitScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignUpScreen";
import SavedWorkoutScreen from "./src/screens/SavedWorkoutScreen";

const Stack = createStackNavigator();

const DropdownMenu = ({ navigation }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionPress = (screen) => {
    setIsOpen(false);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownTrigger}>
        <Icon name="add-outline" size={30} color="#007AFF" />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleOptionPress("CreateWorkout")}
          >
            <Icon
              name="calendar-outline"
              size={20}
              color="#007AFF"
              style={styles.dropdownItemIcon}
            />
            <Text style={styles.dropdownItemText}>7-Day Split</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleOptionPress("CustomSplit")}
          >
            <Icon
              name="create-outline"
              size={20}
              color="#007AFF"
              style={styles.dropdownItemIcon}
            />
            <Text style={styles.dropdownItemText}>Custom Split</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const StackNavigator = () => (
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
          return <DropdownMenu navigation={navigation} />;
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
    <Stack.Screen name="Saved" component={SavedWorkoutScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  dropdownContainer: {
    position: "relative",
    marginRight: 15,
  },
  dropdownTrigger: {
    padding: 5,
  },
  dropdownMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#16213e",
    borderRadius: 10,
    padding: 5,
    width: 180,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  dropdownItemIcon: {
    marginRight: 10,
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default StackNavigator;
