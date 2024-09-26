import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useWorkoutPlan } from "./components/WorkoutPlanContext";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const SavedWorkoutScreen = () => {
  const {
    allWeekPlans,
    loadAllWeekPlans,
    deletePlan,
    selectWeekPlan,
    currentPlanId,
  } = useWorkoutPlan();
  const [localWeekPlans, setLocalWeekPlans] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPlans = async () => {
      await loadAllWeekPlans();
    };
    fetchPlans();
  }, [loadAllWeekPlans]);

  useEffect(() => {
    setLocalWeekPlans(allWeekPlans);
  }, [allWeekPlans]);

  const handleDelete = (planId) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            setLocalWeekPlans((prevPlans) =>
              prevPlans.filter((plan) => plan.id !== planId)
            );
            try {
              await deletePlan(planId);
            } catch (error) {
              console.error("Failed to delete plan:", error);
              Alert.alert(
                "Error",
                "Failed to delete the workout. Please try again."
              );
              setLocalWeekPlans(allWeekPlans);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEdit = (plan) => {
    navigation.navigate("CreateWorkout", { editPlan: plan });
  };

  const handleSelectPlan = (plan) => {
    console.log(
      "Selecting plan in SavedWorkoutScreen:",
      JSON.stringify(plan, null, 2)
    );
    selectWeekPlan(plan);
    Alert.alert(
      "Plan Selected",
      `${plan.name} has been set as your active plan.`,
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  const renderWorkoutPanel = (plan) => {
    const isCurrentPlan = plan.id === currentPlanId;

    return (
      <View key={plan.id} style={styles.workoutPanel}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutName}>{plan.name}</Text>
          {isCurrentPlan && (
            <View style={styles.currentPlanTag}>
              <Text style={styles.currentPlanTagText}>Current Plan</Text>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleSelectPlan(plan)}
            style={[
              styles.selectButton,
              isCurrentPlan && styles.currentSelectButton,
            ]}
          >
            <Icon
              name="checkmark-circle"
              size={24}
              color={isCurrentPlan ? "#FFC107" : "#4CAF50"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleEdit(plan)}
            style={styles.editButton}
          >
            <Icon name="pencil" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(plan.id)}
            style={styles.deleteButton}
          >
            <Icon name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Saved Workouts</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {localWeekPlans.length > 0 ? (
            localWeekPlans.map(renderWorkoutPanel)
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    padding: 10,
    marginRight: 10,
  },
  deleteButton: {
    padding: 10,
  },
  selectButton: {
    padding: 10,
    marginRight: 10,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  currentPlanTag: {
    backgroundColor: "#FFC107",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentPlanTagText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  currentSelectButton: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    borderRadius: 20,
  },
});

export default SavedWorkoutScreen;
