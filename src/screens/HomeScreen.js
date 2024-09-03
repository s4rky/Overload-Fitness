import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { withNavigation } from "react-navigation";
import WeekDays from "./components/WeekDays";
import ProgressGraph from "./components/ProgressGraph";
import WelcomeUser from "./WelcomeUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "./utils/auth";
import { API_URL } from "./config";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const today = new Date();
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
  const [workoutPlan, setWorkoutPlan] = useState({});

  const formattedDate = today.toDateString();
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedNickname = await AsyncStorage.getItem("nickname");
      setNickname(storedNickname || "");
    };
    fetchUserInfo();

    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      setUsername(storedUsername || "");
    };
    fetchUsername();

    navigation.setParams({
      openSplitModal: (event) => {
        const { pageY, pageX } = event.nativeEvent;
        setDropdownPosition({ top: pageY + 40, right: width - pageX });
        setShowSplitModal(true);
      },
    });

    fetchWorkoutPlan();
  }, []);

  const handleOverloadPress = () => {
    navigation.navigate("WorkoutSession");
  };

  const fetchWorkoutPlan = async () => {
    try {
      const response = await fetch(`${API_URL}/workout-plans/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched workout plan:", data);

        const planObject = data.reduce((acc, plan) => {
          acc[plan.day.toLowerCase()] = plan; // Convert day to lowercase
          return acc;
        }, {});

        setWorkoutPlan(planObject);
        console.log("Processed workout plan:", planObject);
      } else {
        throw new Error("Failed to fetch workout plan");
      }
    } catch (error) {
      console.error("Error fetching workout plan:", error);
    }
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
      setShowWorkout(true);
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
    const isToday = selectedDay === today.getDay();
    const dayName = days[selectedDay];
    const workoutHeader = isToday
      ? "Workout for Today"
      : `Workout for ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`;

    const dayPlan = workoutPlan[dayName.toLowerCase()] || {}; // Ensure correct case

    console.log("Rendering workout info for day:", dayName, "Plan:", dayPlan);

    return (
      <View style={styles.workoutContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.workoutHeader}>{workoutHeader}</Text>
        {dayPlan.is_rest ? (
          <Text style={styles.workoutText}>Rest Day</Text>
        ) : (
          <>
            <Text style={styles.workoutText}>{dayPlan.name}</Text>
            {dayPlan.exercises &&
              dayPlan.exercises.map((exercise, index) => (
                <Text key={index} style={styles.workoutText}>
                  {exercise.exercise}
                </Text>
              ))}
          </>
        )}

        {isToday && (
          <TouchableOpacity
            style={styles.overloadButton}
            onPress={handleOverloadPress}
          >
            <Text style={styles.overloadButtonText}>OVERLOAD</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <WelcomeUser nickname={nickname} />
      <Text style={styles.dateText}>{formattedDate}</Text>
      <WeekDays
        selectedDay={selectedDay}
        onDayPress={handleDayPress}
        areDaysClickable={areDaysClickable}
      />
      {showWorkout ? (
        renderWorkoutInfo()
      ) : (
        <>
          <ProgressGraph />
          <View style={styles.buttonContainer}>
            <Button title="Time to Work" onPress={handleWorkPress} />
            <Button title="Skip/Reason Why" onPress={handleSkipPress} />
          </View>
        </>
      )}

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

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

HomeScreen.navigationOptions = ({ navigation }) => ({
  headerRight: () => (
    <TouchableOpacity
      onPress={(event) => navigation.getParam("openSplitModal")(event)}
    >
      <Text style={styles.plusButton}>+</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  workoutContainer: {
    padding: 20,
  },
  workoutHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  goalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  emphasisHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  workoutText: {
    fontSize: 18,
    marginTop: 10,
  },
  overloadButton: {
    marginTop: 30,
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  overloadButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  plusButton: {
    fontSize: 30,
    color: "#007AFF",
    paddingRight: 15,
    paddingLeft: 15,
    paddingVertical: 5,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 150,
  },
  modalOption: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginBottom: 5,
  },
  modalOptionText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default withNavigation(HomeScreen);
