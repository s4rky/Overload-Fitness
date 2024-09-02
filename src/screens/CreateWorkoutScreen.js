import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import ExerciseInput from "./components/ExerciseInput";
import ExerciseDropdown from "./components/ExerciseDropdown";

const DAYS = [
  { key: "sun", label: "S", fullName: "Sunday" },
  { key: "mon", label: "M", fullName: "Monday" },
  { key: "tue", label: "T", fullName: "Tuesday" },
  { key: "wed", label: "W", fullName: "Wednesday" },
  { key: "thu", label: "T", fullName: "Thursday" },
  { key: "fri", label: "F", fullName: "Friday" },
  { key: "sat", label: "S", fullName: "Saturday" },
];

const CreateWorkoutScreen = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayPlans, setDayPlans] = useState({});
  const [dayName, setDayName] = useState("");
  const [isRestDay, setIsRestDay] = useState(false);
  const [exercises, setExercises] = useState([]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setDayName(dayPlans[day.key]?.name || "");
    setIsRestDay(dayPlans[day.key]?.isRest || false);
    setExercises(dayPlans[day.key]?.exercises || []);
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { exercise: "" }]);
  };

  const handleSelectExercise = (index, exercise) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { exercise };
    setExercises(updatedExercises);
  };

  const handleDone = () => {
    if (selectedDay) {
      const dayPlan = isRestDay
        ? { name: "Rest", isRest: true }
        : { name: dayName, isRest: false, exercises };
      setDayPlans({ ...dayPlans, [selectedDay.key]: dayPlan });
      setSelectedDay(null);
      setDayName("");
      setIsRestDay(false);
      setExercises([]);
    }
  };

  const handleSavePlan = () => {
    if (Object.keys(dayPlans).length !== DAYS.length) {
      Alert.alert(
        "Incomplete Plan",
        "Please complete all days before saving the plan."
      );
      return;
    }

    // Here you would typically save the plan to a backend or local storage
    // For this example, we'll just show an alert
    Alert.alert(
      "Plan Saved",
      "Your workout plan has been saved successfully!",
      [{ text: "OK" }]
    );

    console.log("Saved plan:", dayPlans);
  };

  const renderDayButton = (day) => {
    const plan = dayPlans[day.key];
    return (
      <TouchableOpacity
        key={day.key}
        style={[
          styles.dayButton,
          selectedDay?.key === day.key && styles.selectedDayButton,
        ]}
        onPress={() => handleDayClick(day)}
      >
        <Text style={styles.dayButtonLabel}>{day.label}</Text>
        {plan && (
          <Text
            style={styles.dayButtonPlan}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {plan.isRest ? "Rest" : plan.name}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.daySelector}>{DAYS.map(renderDayButton)}</View>
        <ScrollView style={styles.plannerPanel}>
          {selectedDay ? (
            <View style={styles.planContent}>
              <Text style={styles.panelTitle}>
                Plan for {selectedDay.fullName}
              </Text>
              <TextInput
                style={styles.dayNameInput}
                placeholder="Enter day name"
                value={dayName}
                onChangeText={setDayName}
              />
              <TouchableOpacity
                style={styles.restDayButton}
                onPress={() => setIsRestDay(!isRestDay)}
              >
                <Text style={styles.restDayButtonText}>
                  {isRestDay ? "Set as Workout Day" : "Set as Rest Day"}
                </Text>
              </TouchableOpacity>
              {!isRestDay && (
                <>
                  {exercises.map((_, index) => (
                    <View key={index} style={styles.exerciseContainer}>
                      <ExerciseDropdown
                        placeholder="Select an exercise"
                        onSelectExercise={(exercise) =>
                          handleSelectExercise(index, exercise)
                        }
                      />
                      <ExerciseInput />
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddExercise}
                  >
                    <Text style={styles.addButtonText}>+ Add Exercise</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.instructionText}>
              Select a day to start planning
            </Text>
          )}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.savePlanButton} onPress={handleSavePlan}>
        <Text style={styles.savePlanButtonText}>Save Plan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  daySelector: {
    width: 80,
    backgroundColor: "#f0f0f0",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  dayButton: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 5,
  },
  selectedDayButton: {
    backgroundColor: "#e0e0e0",
  },
  dayButtonLabel: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dayButtonPlan: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
  plannerPanel: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  planContent: {
    padding: 20,
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dayNameInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  restDayButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  restDayButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  exerciseContainer: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  doneButton: {
    backgroundColor: "#FFC107",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 25,
  },
  doneButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  instructionText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "#666",
  },
  savePlanButton: {
    backgroundColor: "#FF5722",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  savePlanButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateWorkoutScreen;
