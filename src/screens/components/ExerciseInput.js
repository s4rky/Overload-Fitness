import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ExerciseInput = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sets</Text>
        <View style={styles.inputWrapper}>
          <Icon
            name="fitness-outline"
            size={20}
            color="#4CAF50"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholderTextColor="#666"
            placeholder="0"
          />
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Reps</Text>
        <View style={styles.inputWrapper}>
          <Icon
            name="repeat-outline"
            size={20}
            color="#4CAF50"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholderTextColor="#666"
            placeholder="0"
          />
        </View>
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
    color: "#bbb",
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#fff",
  },
});

export default ExerciseInput;
