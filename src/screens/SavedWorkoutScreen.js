import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useWorkoutPlan } from "./components/WorkoutPlanContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const SavedWorkoutScreen = () => {
  const { allWeekPlans, fetchAllPlans, deleteWeekPlan } = useWorkoutPlan();
  const navigation = useNavigation();

  useEffect(() => {
    fetchAllPlans();
  }, [fetchAllPlans]);

  useFocusEffect(
    useCallback(() => {
      fetchAllPlans();
    }, [fetchAllPlans])
  );

  const handleEditPlan = (plan) => {
    navigation.navigate("CreateWorkout", { plan: plan });
  };

  const handleDeletePlan = (planId) => {
    Alert.alert(
      "Delete Workout Plan",
      "Are you sure you want to delete this workout plan?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteWeekPlan(planId),
          style: "destructive",
        },
      ]
    );
  };

  const renderWorkoutCard = (plan) => {
    if (!plan || typeof plan !== "object") {
      return null;
    }

    return (
      <View key={plan.id} style={styles.card}>
        <Text style={styles.cardTitle}>{plan.name || "Unnamed Plan"}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daysScroll}
        >
          {plan.days &&
            typeof plan.days === "object" &&
            Object.entries(plan.days).map(([day, dayPlan]) => {
              if (!dayPlan) return null;
              return (
                <View key={day} style={styles.dayPreview}>
                  <Text style={styles.dayName}>{day.toUpperCase()}</Text>
                  <Text style={styles.dayFocus}>
                    {dayPlan.isRest ? "Rest" : dayPlan.name || "No name"}
                  </Text>
                  {!dayPlan.isRest &&
                    dayPlan.exercises &&
                    Array.isArray(dayPlan.exercises) && (
                      <Text style={styles.exerciseCount}>
                        {dayPlan.exercises.length} exercises
                      </Text>
                    )}
                </View>
              );
            })}
        </ScrollView>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => handleEditPlan(plan)}
            style={styles.editButton}
          >
            <Icon name="create-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeletePlan(plan.id)}
            style={styles.deleteButton}
          >
            <Icon name="trash-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Saved Workouts</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("CreateWorkout")}
          >
            <Icon name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>New Plan</Text>
          </TouchableOpacity>
          {Array.isArray(allWeekPlans) && allWeekPlans.length > 0 ? (
            allWeekPlans.map((plan) => renderWorkoutCard(plan))
          ) : (
            <Text style={styles.noPlansText}>No workout plans saved yet.</Text>
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
  header: {
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  scrollContent: {
    padding: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  daysScroll: {
    flexGrow: 0,
    marginBottom: 16,
  },
  dayPreview: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    width: 110,
  },
  dayName: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "bold",
  },
  dayFocus: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
    fontWeight: "500",
  },
  exerciseCount: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
    fontSize: 16,
  },
  noPlansText: {
    color: "#bbb",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});

export default SavedWorkoutScreen;
