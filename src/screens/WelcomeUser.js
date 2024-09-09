import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WelcomeUser = ({ nickname }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome Back</Text>
      <Text style={styles.nicknameText}>{nickname}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50", // A green color that matches the app's theme
    textAlign: "left",
  },
  nicknameText: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#2196F3", // A blue color for contrast
    textAlign: "left",
    marginTop: 5,
  },
});

export default WelcomeUser;
