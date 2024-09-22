import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useWorkoutPlan } from "./components/WorkoutPlanContext";

const SavedWorkoutScreen = () => {
  const { allWeekPlans, loadAllWeekPlans, isLoading } = useWorkoutPlan();

  useEffect(() => {
    loadAllWeekPlans();
  }, [loadAllWeekPlans]);

  const renderWorkoutPanel = (workout, index) => (
    <TouchableOpacity key={index} style={styles.workoutPanel}>
      <Text style={styles.workoutName}>{workout.name}</Text>
      {/* You can add more details here if needed */}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Saved Workouts</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading workouts...</Text>
          ) : allWeekPlans.length > 0 ? (
            allWeekPlans.map(renderWorkoutPanel)
          ) : (
            <Text style={styles.noWorkoutsText}>
              No saved workouts. Create a workout to see it here!
            </Text>
          )}
        </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
  },
  scrollContent: {
    padding: 20,
  },
  workoutPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  noWorkoutsText: {
    fontSize: 18,
    color: "#bbb",
    textAlign: "center",
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    color: "#bbb",
    textAlign: "center",
    marginTop: 50,
  },
});

export default SavedWorkoutScreen;
