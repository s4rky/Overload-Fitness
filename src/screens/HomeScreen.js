import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { withNavigation } from "react-navigation";
import WeekDays from "./components/WeekDays";
import ProgressGraph from "./components/ProgressGraph";
import WelcomeUser from "./WelcomeUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "./utils/auth";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useWorkoutPlan } from "./components/WorkoutPlanContext";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const today = new Date();

  const { weekPlan, fetchWeekPlan, isLoading } = useWorkoutPlan();
  const [showWorkout, setShowWorkout] = useState(false);
  const [selectedDay, setSelectedDay] = useState(today.getDay());
  const [areDaysClickable, setAreDaysClickable] = useState(true);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const formattedDate = today.toDateString();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const fetchUserInfo = useCallback(async () => {
    const storedNickname = await AsyncStorage.getItem("nickname");
    setNickname(storedNickname || "");
    const storedUsername = await AsyncStorage.getItem("username");
    setUsername(storedUsername || "");
  }, []);

  useEffect(() => {
    fetchUserInfo();

    navigation.setOptions({
      openSplitModal: (event) => {
        const { pageY, pageX } = event.nativeEvent;
        setDropdownPosition({ top: pageY + 40, right: width - pageX });
        setShowSplitModal(true);
      },
    });

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fetchUserInfo]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        if (isActive && !weekPlan) {
          await fetchWeekPlan();
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [fetchWeekPlan])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        if (isActive && !weekPlan) {
          await fetchWeekPlan();
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [fetchWeekPlan, weekPlan])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        if (isActive && !weekPlan) {
          await fetchWeekPlan();
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [fetchWeekPlan, weekPlan])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        if (isActive && !weekPlan) {
          await fetchWeekPlan();
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [fetchWeekPlan, weekPlan])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        if (isActive && !weekPlan) {
          await fetchWeekPlan();
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [fetchWeekPlan, weekPlan])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        if (isActive && !weekPlan) {
          await fetchWeekPlan();
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [fetchWeekPlan, weekPlan])
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const handleOverloadPress = () => {
    navigation.navigate("WorkoutSession");
  };

  const handleWorkPress = () => {
    setShowWorkout(true);
    setAreDaysClickable(false);
    setSelectedDay(today.getDay());
  };

  const handleBackPress = () => {
    setShowWorkout(false);
    setAreDaysClickable(true);
  };

  const handleSkipPress = () => {
    console.log("Skip/Reason Why button pressed");
  };

  const handleDayPress = (dayIndex) => {
    if (areDaysClickable) {
      setSelectedDay(dayIndex);
    }
  };

  const handleSplitSelection = (splitType) => {
    setShowSplitModal(false);
    if (splitType === "7day") {
      navigation.navigate("CreateWorkout");
    } else {
      navigation.navigate("CustomSplit");
    }
  };

  const renderWorkoutInfo = () => {
    if (isLoading) {
      return <Text style={styles.workoutText}>Loading workout plan...</Text>;
    }

    if (
      !weekPlan ||
      !weekPlan.days ||
      Object.keys(weekPlan.days).length === 0
    ) {
      return <Text style={styles.workoutText}>No workout plan available</Text>;
    }

    const dayKey = days[selectedDay].toLowerCase().slice(0, 3);
    const dayPlan = weekPlan.days[dayKey];

    if (!dayPlan) {
      return (
        <Text style={styles.workoutText}>No workout plan for this day</Text>
      );
    }

    return (
      <Animated.View style={[styles.workoutContainer, { opacity: fadeAnim }]}>
        {showWorkout && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}

        <Text style={styles.workoutHeader}>
          Workout for {days[selectedDay]}
        </Text>
        <Text style={styles.workoutText}>{dayPlan.name}</Text>

        {dayPlan.isRest ? (
          <Text style={styles.restDayText}>Rest Day</Text>
        ) : (
          <>
            <Text style={styles.exercisesHeader}>Exercises:</Text>
            {dayPlan.exercises &&
              dayPlan.exercises.map((exercise, index) => (
                <Text key={index} style={styles.exerciseText}>
                  • {exercise.exercise}
                </Text>
              ))}
          </>
        )}

        {selectedDay === today.getDay() && (
          <TouchableOpacity
            style={styles.overloadButton}
            onPress={handleOverloadPress}
          >
            <LinearGradient
              colors={["#4CAF50", "#45a049"]}
              style={styles.overloadButtonGradient}
            >
              <Text style={styles.overloadButtonText}>OVERLOAD</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <WelcomeUser nickname={nickname} />
        <Text style={styles.dateText}>{formattedDate}</Text>
        <WeekDays
          selectedDay={selectedDay}
          onDayPress={handleDayPress}
          areDaysClickable={areDaysClickable}
        />
        {!showWorkout && selectedDay === today.getDay() ? (
          <>
            <ProgressGraph />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleWorkPress}
              >
                <Text style={styles.actionButtonText}>Time to Work</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.skipButton]}
                onPress={handleSkipPress}
              >
                <Text style={styles.actionButtonText}>Skip/Reason Why</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          renderWorkoutInfo()
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showSplitModal}
        onRequestClose={() => setShowSplitModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSplitModal(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalView,
                {
                  position: "absolute",
                  top: dropdownPosition.top,
                  right: dropdownPosition.right,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSplitSelection("7day")}
              >
                <Text style={styles.modalOptionText}>7 Day Split</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSplitSelection("custom")}
              >
                <Text style={styles.modalOptionText}>Custom Split</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
};

HomeScreen.navigationOptions = ({ navigation }) => ({
  headerRight: () => (
    <TouchableOpacity
      onPress={(event) => navigation.getParam("openSplitModal")(event)}
    >
      <Ionicons
        name="add"
        size={30}
        color="#007AFF"
        style={styles.plusButton}
      />
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  dateText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  workoutContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  workoutHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff",
  },
  workoutText: {
    fontSize: 18,
    marginTop: 10,
    color: "#ddd",
  },
  overloadButton: {
    marginTop: 30,
    borderRadius: 10,
    overflow: "hidden",
  },
  overloadButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  overloadButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  plusButton: {
    paddingRight: 15,
    paddingLeft: 15,
    paddingVertical: 5,
  },
  backButton: {
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#1a1a2e",
    borderRadius: 15,
    padding: 15,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 170,
  },
  modalOption: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  modalOptionText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  logoutButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  logoutButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  exercisesHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#fff",
  },
  exerciseText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#ddd",
    marginBottom: 5,
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
  },
  skipButton: {
    backgroundColor: "#FF3B30",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default withNavigation(HomeScreen);
