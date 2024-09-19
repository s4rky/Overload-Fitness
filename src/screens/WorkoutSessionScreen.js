import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useWorkoutPlan } from "./components/WorkoutPlanContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const WorkoutSessionScreen = () => {
  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const flatListRef = useRef(null);
  const [exercises, setExercises] = useState([]);
  const [dayName, setDayName] = useState("");
  const { weekPlan } = useWorkoutPlan();

  useEffect(() => {
    loadTodayWorkout();
  }, [weekPlan]);

  const loadTodayWorkout = () => {
    if (!weekPlan || !weekPlan.days) {
      setDayName("No workout plan available");
      setExercises([]);
      return;
    }

    const today = new Date()
      .toLocaleString("en-us", { weekday: "short" })
      .toLowerCase();
    const todayPlan = weekPlan.days[today];

    if (todayPlan && !todayPlan.isRest) {
      setDayName(todayPlan.name);
      const formattedExercises = todayPlan.exercises.map((exercise) => ({
        name: exercise.exercise,
        skipped: false,
        sets: exercise.sets.map((set) => ({
          weight: set.weight,
          targetReps: set.reps,
          isWarmup: set.isWarmup,
          completedReps: 0,
          isCompleted: false,
          skipped: false,
        })),
      }));
      setExercises(formattedExercises);
    } else {
      setDayName("Rest Day");
      setExercises([]);
    }
  };

  const toggleTableOfContents = () => setIsTableOfContentsOpen((prev) => !prev);

  const scrollToExercise = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentExercise(index);
  };

  const handleExerciseSelect = (index) => {
    scrollToExercise(index);
    setIsTableOfContentsOpen(false);
  };

  const updateExerciseState = (exerciseIndex, updateFunction) => {
    setExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updateFunction(updatedExercises[exerciseIndex]);
      return updatedExercises;
    });
  };

  const handleBeginSet = (exerciseIndex, setIndex) => {
    console.log(
      `Begin set ${setIndex + 1} for ${exercises[exerciseIndex].name}`
    );
  };

  const handleContinueWithoutRecording = (exerciseIndex, setIndex) => {
    console.log(
      `Skipped recording set ${setIndex + 1} for ${
        exercises[exerciseIndex].name
      }`
    );
  };

  const handleSetSkipToggle = (exerciseIndex, setIndex) => {
    updateExerciseState(exerciseIndex, (exercise) => {
      exercise.sets[setIndex].skipped = !exercise.sets[setIndex].skipped;
    });
  };

  const handleExerciseSkipToggle = () => {
    updateExerciseState(currentExercise, (exercise) => {
      exercise.skipped = !exercise.skipped;
    });

    if (
      !exercises[currentExercise].skipped &&
      currentExercise < exercises.length - 1
    ) {
      scrollToExercise(currentExercise + 1);
    }
  };

  const SetButton = ({ title, onPress, style, textStyle, icon }) => (
    <TouchableOpacity style={[styles.setButton, style]} onPress={onPress}>
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color="#fff"
          style={styles.buttonIcon}
        />
      )}
      <Text
        style={[styles.setButtonText, textStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderSetItem = (exerciseIndex, set, setIndex) => (
    <View style={styles.setItem} key={setIndex}>
      <View style={styles.setContent}>
        <Text style={styles.setText}>Set {setIndex + 1}</Text>
        <Text style={styles.setInfo}>Weight: {set.weight}lbs</Text>
        <Text style={styles.setInfo}>Target Reps: {set.targetReps}</Text>
        {set.isWarmup && <Text style={styles.warmupText}>Warmup</Text>}
      </View>
      <View style={styles.setButtons}>
        {!set.skipped ? (
          <>
            <SetButton
              title="Begin"
              icon="camera-outline"
              onPress={() => handleBeginSet(exerciseIndex, setIndex)}
              style={styles.primarySetButton}
            />
            <SetButton
              title="Continue"
              icon="play-outline"
              onPress={() =>
                handleContinueWithoutRecording(exerciseIndex, setIndex)
              }
              style={styles.secondarySetButton}
            />
            <SetButton
              title="Skip"
              icon="close-outline"
              onPress={() => handleSetSkipToggle(exerciseIndex, setIndex)}
              style={styles.skipButton}
            />
          </>
        ) : (
          <SetButton
            title="Unskip"
            icon="refresh-outline"
            onPress={() => handleSetSkipToggle(exerciseIndex, setIndex)}
            style={styles.unskipButton}
          />
        )}
      </View>
    </View>
  );

  const renderExerciseItem = ({ item, index }) => (
    <View style={[styles.exerciseContainer, { width: SCREEN_WIDTH }]}>
      <View style={styles.exerciseContentWrapper}>
        <View
          style={[
            styles.exerciseContent,
            item.skipped && styles.skippedExerciseContent,
          ]}
        >
          {item.skipped && (
            <View style={styles.skippedOverlay}>
              <Ionicons name="close-circle" size={24} color="#FF5252" />
            </View>
          )}
          <Text style={styles.exerciseTitle}>
            Exercise {index + 1}: {item.name}
          </Text>
          <ScrollView style={styles.setsScrollView}>
            {item.sets.map((set, setIndex) =>
              renderSetItem(index, set, setIndex)
            )}
          </ScrollView>
          {!item.skipped && (
            <TouchableOpacity
              style={styles.skipExerciseButton}
              onPress={handleExerciseSkipToggle}
            >
              <Text style={styles.skipExerciseButtonText}>Skip Exercise</Text>
            </TouchableOpacity>
          )}
        </View>
        {item.skipped && (
          <TouchableOpacity
            style={styles.unskipExerciseButton}
            onPress={handleExerciseSkipToggle}
          >
            <Text style={styles.unskipExerciseButtonText}>Unskip Exercise</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{dayName}</Text>
          </View>

          {exercises.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={exercises}
              renderItem={renderExerciseItem}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={SCREEN_WIDTH}
              decelerationRate="fast"
              contentContainerStyle={styles.flatListContainer}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                setCurrentExercise(index);
              }}
            />
          ) : (
            <View style={styles.restDayContainer}>
              <Text style={styles.restDayText}>
                {dayName === "Rest Day" ? "Enjoy your rest day!" : dayName}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.tocButton,
            isTableOfContentsOpen && styles.tocButtonOpen,
          ]}
          onPress={toggleTableOfContents}
        >
          <Ionicons
            name={isTableOfContentsOpen ? "chevron-forward" : "chevron-back"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        {isTableOfContentsOpen && (
          <ScrollView style={styles.tableOfContents}>
            <Text style={styles.tocTitle}>Exercises for Today</Text>
            {exercises.map((exercise, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleExerciseSelect(index)}
                style={styles.tocItemContainer}
              >
                <Text
                  style={[
                    styles.tocItem,
                    currentExercise === index && styles.tocItemActive,
                  ]}
                >
                  {index + 1}. {exercise.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  mainContent: { flex: 1 },
  header: { marginBottom: 20, paddingHorizontal: 20, paddingTop: 20 },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
  },
  flatListContainer: { justifyContent: "center" },
  exerciseContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  exerciseContentWrapper: { width: "100%" },
  exerciseContent: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 20,
    width: "100%",
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  setsScrollView: { maxHeight: 400 },
  setItem: {
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    padding: 15,
    position: "relative",
  },
  setText: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  setInfo: { fontSize: 16, color: "#bbb", marginBottom: 5 },
  setButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  setButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  buttonIcon: {
    marginRight: 5,
  },
  setButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  primarySetButton: { backgroundColor: "#4CAF50" },
  secondarySetButton: { backgroundColor: "#FF9800" },
  skipButton: { backgroundColor: "#FF5252" },
  unskipButton: { backgroundColor: "#4CAF50" },
  tocButton: {
    position: "absolute",
    right: 0,
    top: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  tocButtonOpen: { right: 250 },
  tableOfContents: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "rgba(26, 26, 46, 0.95)",
    padding: 20,
    paddingTop: 60,
  },
  tocTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  tocItemContainer: { paddingVertical: 10 },
  tocItem: { fontSize: 18, color: "#bbb" },
  tocItemActive: { color: "#4CAF50", fontWeight: "bold" },
  skipExerciseButton: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5252",
    padding: 15,
    borderRadius: 8,
    width: "100%",
  },
  skipExerciseButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  unskipExerciseButton: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    width: "100%",
  },
  unskipExerciseButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  skippedExerciseContent: { opacity: 0.6 },
  skippedOverlay: { position: "absolute", top: 10, left: 10, zIndex: 1 },
  warmupText: {
    fontSize: 14,
    color: "#FFA500",
    fontWeight: "bold",
    marginTop: 5,
  },
  restDayContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  restDayText: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
  },
});

export default WorkoutSessionScreen;
