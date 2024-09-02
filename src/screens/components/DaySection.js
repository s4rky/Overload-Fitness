import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

const DaySection = ({ dayNumber, dayName, setDayName }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.dayText}>Day {dayNumber}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Day Name"
        value={dayName}
        onChangeText={(text) => setDayName(dayNumber, text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: "80%", // Adjust as needed
  },
});

export default DaySection;
