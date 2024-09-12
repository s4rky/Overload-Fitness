import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

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

export default CustomDrawerContent;
