import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Animated,
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
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchPlans = async () => {
      await loadAllWeekPlans();
    };
    fetchPlans();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [loadAllWeekPlans, fadeAnim]);

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
      <Animated.View
        key={plan.id}
        style={[styles.workoutPanel, { opacity: fadeAnim }]}
      >
        <LinearGradient
          colors={
            isCurrentPlan ? ["#2E7D32", "#1B5E20"] : ["#2c3e50", "#34495e"]
          }
          style={styles.gradientBackground}
        >
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutName}>{plan.name}</Text>
            {isCurrentPlan && (
              <View style={styles.currentPlanTag}>
                <Icon name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.currentPlanTagText}>Current Plan</Text>
              </View>
            )}
          </View>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutInfoText}>
              {Object.values(plan.data).filter((day) => !day.isRest).length}{" "}
              workout days
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleSelectPlan(plan)}
              style={[
                styles.button,
                isCurrentPlan
                  ? styles.currentSelectButton
                  : styles.selectButton,
              ]}
            >
              <Icon name="play-circle-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleEdit(plan)}
              style={[styles.button, styles.editButton]}
            >
              <Icon name="pencil-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(plan.id)}
              style={[styles.button, styles.deleteButton]}
            >
              <Icon name="trash-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>My Plans</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {localWeekPlans.length > 0 ? (
            localWeekPlans.map(renderWorkoutPanel)
          ) : (
            <Text style={styles.noWorkoutsText}>
              No saved workouts. Create a workout to see it here!
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateWorkout")}
        >
          <Icon name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Create New Workout</Text>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
  },
  scrollContent: {
    padding: 20,
  },
  workoutPanel: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientBackground: {
    padding: 20,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  currentPlanTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  currentPlanTagText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  workoutInfo: {
    marginBottom: 15,
  },
  workoutInfoText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  selectButton: {
    backgroundColor: "#4CAF50",
  },
  currentSelectButton: {
    backgroundColor: "#81C784",
  },
  editButton: {
    backgroundColor: "#FFA000",
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
  },
  noWorkoutsText: {
    fontSize: 18,
    color: "#bbb",
    textAlign: "center",
    marginTop: 50,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default SavedWorkoutScreen;
