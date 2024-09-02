import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const ExerciseInput = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sets</Text>
        <TextInput style={styles.input} keyboardType="numeric" />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Reps</Text>
        <TextInput style={styles.input} keyboardType="numeric" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

export default ExerciseInput;
