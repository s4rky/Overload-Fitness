import React, { useState, useCallback, useRef, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import ExerciseInput from "./components/ExerciseInput";
import ExerciseDropdown from "./components/ExerciseDropdown";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { saveWeekPlan } from "./utils/auth";

import { useWorkoutPlan } from "./components/WorkoutPlanContext";

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
  const [dayPlans, setDayPlans] = useState(() => {
    const initialPlans = {};
    DAYS.forEach((day) => {
      initialPlans[day.key] = { name: "Rest", isRest: true };
    });
    return initialPlans;
  });
  const [dayName, setDayName] = useState("");
  const [isRestDay, setIsRestDay] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const { weekPlan, updateWeekPlan } = useWorkoutPlan();
  const dayNameInputRef = useRef(null);
  const workoutNameInputRef = useRef(null);
  const [expandedExerciseIndex, setExpandedExerciseIndex] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    Alert.alert(
      "Welcome to Workout Plan Creation",
      "Please start by entering a name for your workout plan.",
      [
        {
          text: "OK",
          onPress: () => {
            workoutNameInputRef.current?.focus();
          },
        },
      ]
    );
  }, []);
  const handleDayClick = useCallback(
    (day) => {
      setSelectedDay(day);
      const currentPlan = dayPlans[day.key];
      setDayName(currentPlan.name);
      setIsRestDay(currentPlan.isRest);
      setExercises(currentPlan.exercises || []);
    },
    [dayPlans]
  );

  const handleToggleRestDay = useCallback(() => {
    setIsRestDay((prev) => !prev);
    if (isRestDay) {
      setDayName("");
      setTimeout(() => {
        dayNameInputRef.current?.focus();
      }, 0);
    } else {
      setDayName("Rest");
    }
  }, [isRestDay]);

  const handleAddExercise = useCallback(() => {
    setExercises((prev) => [...prev, { exercise: "", sets: [] }]);
    setExpandedExerciseIndex(exercises.length); // Expand the newly added exercise
  }, [exercises.length]);

  const toggleExerciseExpansion = useCallback((index) => {
    setExpandedExerciseIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  }, []);

  const renderExercise = useCallback(
    (exercise, index) => {
      const isExpanded = expandedExerciseIndex === index;
      return (
        <View key={index} style={styles.exerciseContainer}>
          <TouchableOpacity onPress={() => toggleExerciseExpansion(index)}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>
                {exercise.exercise || `Exercise ${index + 1}`}
              </Text>
              <Icon
                name={
                  isExpanded ? "chevron-up-outline" : "chevron-down-outline"
                }
                size={24}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
          {isExpanded && (
            <>
              <ExerciseDropdown
                placeholder="Select an exercise"
                onSelectExercise={(exercise) =>
                  handleSelectExercise(index, exercise)
                }
              />
              <View style={styles.exerciseInputWrapper}>
                <ExerciseInput
                  initialSets={exercise.sets}
                  onUpdateSets={(setsData) =>
                    handleUpdateExerciseData(index, setsData)
                  }
                />
              </View>
            </>
          )}
        </View>
      );
    },
    [
      expandedExerciseIndex,
      handleSelectExercise,
      handleUpdateExerciseData,
      toggleExerciseExpansion,
    ]
  );

  const handleSelectExercise = useCallback((index, exercise) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], exercise };
      return updated;
    });
  }, []);

  const handleUpdateExerciseData = useCallback((index, setsData) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], sets: setsData };
      return updated;
    });
  }, []);

  const handleDone = useCallback(() => {
    if (selectedDay) {
      const dayPlan = isRestDay
        ? { name: "Rest", isRest: true }
        : { name: dayName, isRest: false, exercises };

      Alert.alert(
        "Save Day Plan",
        `Are you sure you want to save the plan for ${selectedDay.fullName}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Save",
            onPress: () => {
              setDayPlans((prev) => ({ ...prev, [selectedDay.key]: dayPlan }));
              setSelectedDay(null);
              setDayName("");
              setIsRestDay(false);
              setExercises([]);
              Alert.alert(
                "Success",
                `Plan for ${selectedDay.fullName} has been saved.`
              );
            },
          },
        ]
      );
    }
  }, [selectedDay, isRestDay, dayName, exercises]);

  const handleSavePlan = useCallback(async () => {
    if (Object.keys(dayPlans).length !== DAYS.length) {
      Alert.alert(
        "Incomplete Plan",
        "Please complete all days before saving the plan."
      );
      return;
    }

    if (!workoutName.trim()) {
      Alert.alert(
        "Missing Workout Name",
        "Please enter a name for your workout plan."
      );
      return;
    }

    const planToSave = {
      name: workoutName,
      days: dayPlans,
    };

    try {
      await updateWeekPlan(planToSave);
      Alert.alert(
        "Plan Saved",
        "Your workout plan has been saved successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"), // Navigate to HomeScreen
          },
        ]
      );
      console.log("Saved plan:", JSON.stringify(planToSave, null, 2));
    } catch (error) {
      console.error("Error saving plan:", error);
      Alert.alert(
        "Error",
        "There was an error saving your plan. Please try again."
      );
    }
  }, [dayPlans, workoutName, updateWeekPlan, navigation]);

  const renderDayButton = useCallback(
    (day) => {
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
    },
    [dayPlans, selectedDay, handleDayClick]
  );

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.daySelector}>{DAYS.map(renderDayButton)}</View>
          <ScrollView style={styles.plannerPanel}>
            <TextInput
              ref={workoutNameInputRef}
              style={styles.workoutNameInput}
              placeholder="Enter workout plan name"
              placeholderTextColor="#888"
              value={workoutName}
              onChangeText={setWorkoutName}
            />
            {selectedDay ? (
              <View style={styles.planContent}>
                <Text style={styles.panelTitle}>
                  Plan for {selectedDay.fullName}
                </Text>
                <TextInput
                  ref={dayNameInputRef}
                  style={styles.dayNameInput}
                  placeholder="Enter day name"
                  placeholderTextColor="#888"
                  value={dayName}
                  onChangeText={setDayName}
                />
                <TouchableOpacity
                  style={styles.restDayButton}
                  onPress={handleToggleRestDay}
                >
                  <Text style={styles.restDayButtonText}>
                    {isRestDay ? "Set as Workout Day" : "Set as Rest Day"}
                  </Text>
                </TouchableOpacity>
                {!isRestDay && (
                  <>
                    {exercises.map(renderExercise)}
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddExercise}
                    >
                      <Icon name="add-outline" size={24} color="#fff" />
                      <Text style={styles.addButtonText}>Add Exercise</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={handleDone}
                >
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
        <TouchableOpacity
          style={styles.savePlanButton}
          onPress={handleSavePlan}
        >
          <Text style={styles.savePlanButtonText}>Save Plan</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  daySelector: {
    width: 80,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  dayButton: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    padding: 5,
  },
  selectedDayButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dayButtonLabel: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
  },
  dayButtonPlan: {
    fontSize: 12,
    textAlign: "center",
    color: "#bbb",
  },
  plannerPanel: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  planContent: {
    padding: 20,
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  dayNameInput: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#fff",
  },
  restDayButton: {
    backgroundColor: "#4CAF50",
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
    flexDirection: "row",
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
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
    color: "#bbb",
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
  exerciseContainer: {
    marginBottom: 25, // Increased from 15 to create more space between exercises
  },
  exerciseInputWrapper: {
    marginTop: 15, // This adds space between the dropdown and the input
  },
  workoutNameInput: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#fff",
    width: "100%",
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateWorkoutScreen;
