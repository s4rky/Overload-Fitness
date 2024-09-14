import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const BurgerMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Main", { screen: "HomeScreen" })}
      >
        <Text style={styles.menuItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Main", { screen: "CreateWorkout" })}
      >
        <Text style={styles.menuItemText}>Create Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Main", { screen: "CustomSplit" })}
      >
        <Text style={styles.menuItemText}>Custom Split</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#1a1a2e",
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  menuItemText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default BurgerMenu;
