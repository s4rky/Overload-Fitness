import React, { useState, useEffect } from "react";
import {
  Appearance,
  useColorScheme,
  StatusBar,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ThemeProvider } from "./src/screens/context/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";

// Import your screens
import HomeScreen from "./src/screens/HomeScreen";
import CreateWorkoutScreen from "./src/screens/CreateWorkoutScreen";
import WorkoutSessionScreen from "./src/screens/WorkoutSessionScreen";
import CustomSplitScreen from "./src/screens/CustomSplitScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignUpScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DropdownMenu = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);

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
  </Stack.Navigator>
);

const CustomDrawerContent = (props) => {
  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e"]}
      style={styles.drawerContainer}
    >
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Icon name="fitness-outline" size={50} color="#007AFF" />
          <Text style={styles.drawerHeaderText}>Overload</Text>
        </View>
        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate("Home")}
          icon={({ color, size }) => (
            <Icon name="home-outline" color="#007AFF" size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
        />
        <DrawerItem
          label="Logout"
          onPress={() => {
            // Implement your logout logic here
            props.navigation.navigate("Login");
          }}
          icon={({ color, size }) => (
            <Icon name="log-out-outline" color="#FF3B30" size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
        />
      </DrawerContentScrollView>
    </LinearGradient>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: {
        backgroundColor: "#1a1a2e",
        width: 240,
      },
      drawerLabelStyle: {
        color: "#fff",
      },
      drawerActiveBackgroundColor: "rgba(0, 122, 255, 0.2)",
      drawerActiveTintColor: "#007AFF",
      drawerInactiveTintColor: "#fff",
      headerShown: false,
    }}
  >
    <Drawer.Screen
      name="MainStack"
      component={MainStack}
      options={{
        drawerItemStyle: { display: "none" },
      }}
    />
  </Drawer.Navigator>
);

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
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  drawerHeaderText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  drawerItemLabel: {
    color: "#fff",
    fontSize: 16,
  },
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

export default App;
