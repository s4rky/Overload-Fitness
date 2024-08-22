import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const WeekDays = () => {
  // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const today = new Date().getDay();

  // Days of the week array
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View style={styles.container}>
      {days.map((day, index) => (
        <View
          key={index}
          style={[
            styles.dayContainer,
            index === today && styles.highlightedDayContainer,
          ]}
        >
          <Text
            style={[
              styles.dayText,
              index === today && styles.highlightedDayText,
            ]}
          >
            {day}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between", // Spread out the days even more
    marginHorizontal: 30, // Increase margin to spread the days more
  },
  dayContainer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightedDayContainer: {
    backgroundColor: "#ffeb3b",
    borderRadius: 4,
    paddingHorizontal: 10, // Adjust padding to make the highlight box more visible
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  highlightedDayText: {
    color: "white",
  },
});

export default WeekDays;
