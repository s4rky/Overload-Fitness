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
            index === selectedDay && styles.selectedDayContainer,
            !areDaysClickable && styles.disabledDayContainer,
          ]}
          onPress={() => areDaysClickable && onDayPress(index)}
          disabled={!areDaysClickable}
        >
          <Text
            style={[
              styles.dayText,
              index === selectedDay && styles.selectedDayText,
              !areDaysClickable && styles.disabledDayText,
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  dayContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  selectedDayContainer: {
    backgroundColor: "#2196F3",
  },
  disabledDayContainer: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  selectedDayText: {
    color: "#fff",
  },
  disabledDayText: {
    color: "rgba(255, 255, 255, 0.5)",
  },
});

export default WeekDays;
