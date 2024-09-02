import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WelcomeUser = ({ username }) => {
  return (
    <View>
      <Text style={styles.welcomeText}>Welcome Back {username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default WelcomeUser;
