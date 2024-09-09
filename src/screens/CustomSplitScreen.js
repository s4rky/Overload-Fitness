import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import ExerciseInput from "./components/ExerciseInput";
import ExerciseDropdown from "./components/ExerciseDropdown";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const CustomSplitScreen = () => {
  const [numDays, setNumDays] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayPlans, setDayPlans] = useState({});
  const [dayName, setDayName] = useState("");
  const [isRestDay, setIsRestDay] = useState(false);
  const [exercises, setExercises] = useState([]);
  const scrollViewRef = useRef(null);

  const handleNumDaysChange = (text) => {
    setNumDays(text);
    setSelectedDay(null);
    setDayPlans({});
  };

  const isValidNumDays = parseInt(numDays) >= 3 && parseInt(numDays) <= 14;

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setDayName(dayPlans[day]?.name || "");
    setIsRestDay(dayPlans[day]?.isRest || false);
    setExercises(dayPlans[day]?.exercises || []);
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
      setDayPlans({ ...dayPlans, [selectedDay]: dayPlan });
      setSelectedDay(null);
      setDayName("");
      setIsRestDay(false);
      setExercises([]);
    }
  };

  const handleSavePlan = () => {
    if (Object.keys(dayPlans).length !== parseInt(numDays)) {
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
    const plan = dayPlans[day];
    return (
      <TouchableOpacity
        key={day}
        style={[
          styles.dayButton,
          selectedDay === day && styles.selectedDayButton,
        ]}
        onPress={() => handleDayClick(day)}
      >
        <Text style={styles.dayButtonLabel}>{`Day ${day}`}</Text>
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
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Enter number of days (3-14):</Text>
          <View style={styles.numDaysInputContainer}>
            <Icon
              name="calendar-outline"
              size={20}
              color="#4CAF50"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.numDaysInput}
              value={numDays}
              onChangeText={handleNumDaysChange}
              keyboardType="numeric"
              maxLength={2}
              placeholderTextColor="#666"
            />
          </View>
          {numDays !== "" && !isValidNumDays && (
            <Text style={styles.errorText}>
              Please enter a valid number between 3 and 14
            </Text>
          )}
        </View>
        {isValidNumDays && (
          <>
            <View style={styles.content}>
              <ScrollView
                ref={scrollViewRef}
                style={styles.daySelector}
                showsVerticalScrollIndicator={false}
              >
                {[...Array(parseInt(numDays))].map((_, index) =>
                  renderDayButton(index + 1)
                )}
              </ScrollView>
              <ScrollView style={styles.plannerPanel}>
                {selectedDay ? (
                  <View style={styles.planContent}>
                    <Text style={styles.panelTitle}>
                      Plan for Day {selectedDay}
                    </Text>
                    <View style={styles.dayNameInputContainer}>
                      <Icon
                        name="create-outline"
                        size={20}
                        color="#4CAF50"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.dayNameInput}
                        placeholder="Enter day name"
                        placeholderTextColor="#666"
                        value={dayName}
                        onChangeText={setDayName}
                      />
                    </View>
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
          </>
        )}
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
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  numDaysInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  inputIcon: {
    padding: 10,
  },
  numDaysInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    color: "#FF5252",
    marginTop: 5,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  daySelector: {
    width: width / 3,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  dayButtonLabel: {
    fontSize: 16,
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
    width: (width * 2) / 3,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
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
  dayNameInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  dayNameInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#fff",
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
    flexDirection: "row",
    backgroundColor: "#4CAF50",
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
});

export default CustomSplitScreen;
