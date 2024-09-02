import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

const ExerciseDropdown = ({ placeholder, onSelectExercise }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    placeholder || "Select an exercise"
  );
  const [isCustomExercise, setIsCustomExercise] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState("");

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const handleSelect = (value) => {
    if (value === "Custom Exercise") {
      setIsCustomExercise(true);
    } else {
      setSelectedValue(value);
      setIsVisible(false);
      setIsCustomExercise(false);
      onSelectExercise(value);
    }
  };

  const handleCustomExerciseChange = (text) => {
    setCustomExerciseName(text);
  };

  const handleCustomExerciseSubmit = () => {
    if (customExerciseName.trim()) {
      setSelectedValue(customExerciseName);
      setIsVisible(false);
      setIsCustomExercise(false);
      onSelectExercise(customExerciseName);
    }
  };

  const exercises = [
    "Ex A",
    "Ex B",
    "Ex C",
    "Ex D",
    "Custom Exercise", // Custom option
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
        <Text style={styles.selectedValue}>{selectedValue}</Text>
        <Text style={styles.icon}>(v)</Text>
      </TouchableOpacity>

      {isVisible && (
        <ScrollView style={styles.dropdownContent}>
          {exercises.map((exercise) => (
            <TouchableOpacity
              key={exercise}
              onPress={() => handleSelect(exercise)}
              style={styles.option}
            >
              <Text style={styles.optionText}>{exercise}</Text>
            </TouchableOpacity>
          ))}

          {isCustomExercise && (
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Enter custom exercise"
                value={customExerciseName}
                onChangeText={handleCustomExerciseChange}
                onSubmitEditing={handleCustomExerciseSubmit}
              />
              <TouchableOpacity
                onPress={handleCustomExerciseSubmit}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
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
  customInputContainer: {
    padding: 10,
  },
  customInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ExerciseDropdown;
