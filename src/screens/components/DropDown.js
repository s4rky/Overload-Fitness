import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const DropDown = ({ placeholder, unavailableDays, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    placeholder || "Pick a day"
  );

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsVisible(false);
    onSelect(value); // Notify parent about selection
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ].filter((day) => !unavailableDays.includes(day));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
        <Text style={styles.selectedValue}>{selectedValue}</Text>
        <Text style={styles.icon}>(v)</Text>
      </TouchableOpacity>

      {isVisible && (
        <ScrollView style={styles.dropdownContent}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => handleSelect(day)}
              style={styles.option}
            >
              <Text style={styles.optionText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  selectedValue: {
    fontSize: 16,
    color: "#333",
  },
  icon: {
    fontSize: 16,
    color: "#333",
  },
  dropdownContent: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 200, // Adjust as needed
  },
  option: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DropDown;
