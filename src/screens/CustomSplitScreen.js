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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Enter number of days (3-14):</Text>
        <TextInput
          style={styles.numDaysInput}
          value={numDays}
          onChangeText={handleNumDaysChange}
          keyboardType="numeric"
          maxLength={2}
        />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  numDaysInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  daySelector: {
    width: width / 3,
    backgroundColor: "#f0f0f0",
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dayButtonPlan: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
  plannerPanel: {
    width: (width * 2) / 3,
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

export default CustomSplitScreen;
