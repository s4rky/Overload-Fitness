import React, { useState, useRef } from "react";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const WorkoutSessionScreen = () => {
  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const flatListRef = useRef(null);

  const [exercises, setExercises] = useState(
    [
      {
        name: "Squats",
        sets: [
          { weight: 150, targetReps: 10 },
          { weight: 160, targetReps: 8 },
          { weight: 170, targetReps: 6 },
        ],
      },
      {
        name: "Bench Press",
        sets: [
          { weight: 120, targetReps: 8 },
          { weight: 130, targetReps: 6 },
          { weight: 140, targetReps: 4 },
        ],
      },
    ].map((exercise) => ({
      ...exercise,
      skipped: false,
      sets: exercise.sets.map((set) => ({
        ...set,
        completedReps: 0,
        isCompleted: false,
        skipped: false,
      })),
    }))
  );

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

  const SetButton = ({ title, onPress, style, textStyle }) => (
    <TouchableOpacity style={[styles.setButton, style]} onPress={onPress}>
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
      </View>
      <View style={styles.setButtons}>
        {!set.skipped ? (
          <>
            <SetButton
              title="📷 Begin"
              onPress={() => handleBeginSet(exerciseIndex, setIndex)}
              style={styles.primarySetButton}
            />
            <SetButton
              title="Continue"
              onPress={() =>
                handleContinueWithoutRecording(exerciseIndex, setIndex)
              }
              style={styles.secondarySetButton}
              textStyle={styles.secondaryButtonText}
            />
            <SetButton
              title="Skip"
              onPress={() => handleSetSkipToggle(exerciseIndex, setIndex)}
              style={styles.skipButton}
              textStyle={styles.skipButtonText}
            />
          </>
        ) : (
          <SetButton
            title="Unskip"
            onPress={() => handleSetSkipToggle(exerciseIndex, setIndex)}
            style={styles.unskipButton}
            textStyle={styles.unskipButtonText}
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
              <Text style={styles.skippedText}>❌</Text>
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Workout Session</Text>
          </View>

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
        </View>

        <TouchableOpacity
          style={[
            styles.tocButton,
            isTableOfContentsOpen && styles.tocButtonOpen,
          ]}
          onPress={toggleTableOfContents}
        >
          <Text style={styles.tocButtonText}>
            {isTableOfContentsOpen ? ">" : "<"}
          </Text>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, flexDirection: "row" },
  mainContent: { flex: 1 },
  header: { marginBottom: 20, paddingHorizontal: 20, paddingTop: 20 },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
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
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  setsScrollView: { maxHeight: 400 },
  setItem: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    position: "relative",
  },
  setText: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 },
  setInfo: { fontSize: 16, color: "#666", marginBottom: 5 },
  setButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  setButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  setButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  primarySetButton: { backgroundColor: "#4CAF50" },
  secondarySetButton: { backgroundColor: "#FF9800" },
  secondaryButtonText: { color: "#fff" },
  skipButton: { backgroundColor: "#FF5722" },
  skipButtonText: { color: "#fff" },
  unskipButton: { backgroundColor: "#4CAF50" },
  unskipButtonText: { color: "#fff" },
  tocButton: {
    position: "absolute",
    right: 0,
    top: 40,
    backgroundColor: "#007AFF",
    padding: 10,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  tocButtonOpen: { right: 250 },
  tocButtonText: { color: "#fff", fontSize: 20 },
  tableOfContents: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  tocTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  tocItemContainer: { paddingVertical: 10 },
  tocItem: { fontSize: 18, color: "#666" },
  tocItemActive: { color: "#4CAF50", fontWeight: "bold" },
  skipExerciseButton: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5722",
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
  skippedText: { fontSize: 24, color: "#FF5722" },
});

export default WorkoutSessionScreen;
