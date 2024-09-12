import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WeekDays from "./components/WeekDays"; // Import the WeekDays component

const CurrentDate = () => {
  // Get the current date
  const today = new Date();

  // Format the date into a readable string
  const formattedDate = today.toDateString(); // Example: "Wed Aug 21 2024"

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{formattedDate}</Text>
      <WeekDays />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10, // Reduce padding to position the date higher
    paddingLeft: 10, // Reduce padding to position the date further left
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default CurrentDate;
