import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const WeekDays = ({ selectedDay, onDayPress, areDaysClickable }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View style={styles.container}>
      {days.map((day, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dayContainer,
            index === selectedDay && styles.highlightedDayContainer,
          ]}
          onPress={() => areDaysClickable && onDayPress(index)} // Handle day click based on areDaysClickable
          disabled={!areDaysClickable} // Disable press if not clickable
        >
          <Text
            style={[
              styles.dayText,
              index === selectedDay && styles.highlightedDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
  },
  dayContainer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightedDayContainer: {
    backgroundColor: "#ffeb3b",
    borderRadius: 4,
    paddingHorizontal: 10,
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
