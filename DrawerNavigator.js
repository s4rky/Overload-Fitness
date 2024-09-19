import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const Drawer = createDrawerNavigator();

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
          label="Saved Workouts"
          onPress={() => {
            // Implement your logout logic here
            props.navigation.navigate("My Plans");
          }}
          icon={({ color, size }) => (
            <Icon name="save-outline" color="#007AFF" size={size} />
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

const DrawerNavigator = () => {
  const StackNavigator = require("./StackNavigator").default;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#1a1a2e",
          width: 250,
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
        component={StackNavigator}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator>
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
});

export default DrawerNavigator;
