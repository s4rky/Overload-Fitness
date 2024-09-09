import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const exerciseData = {
  Chest: {
    "Upper Chest": {
      Freeweight: [
        {
          name: "Incline Bench Press",
          keywords: ["upper chest", "pecs", "pressing"],
        },
        {
          name: "Incline Dumbbell Press",
          keywords: ["upper chest", "pecs", "pressing"],
        },
        {
          name: "Reverse Grip Bench Press",
          keywords: ["upper chest", "pecs", "pressing"],
        },
        {
          name: "Incline Push-Ups",
          keywords: ["upper chest", "pecs", "bodyweight"],
        },
      ],
      Machine: [
        {
          name: "Incline Smith Machine Press",
          keywords: ["upper chest", "pecs", "pressing", "machine"],
        },
        {
          name: "Incline Hammer Strength Press",
          keywords: ["upper chest", "pecs", "pressing", "machine"],
        },
      ],
      Cable: [
        {
          name: "Low-to-High Cable Flyes",
          keywords: ["upper chest", "pecs", "flyes", "cable"],
        },
        {
          name: "Incline Cable Press",
          keywords: ["upper chest", "pecs", "pressing", "cable"],
        },
      ],
    },
    "Lower Chest": {
      Freeweight: [
        {
          name: "Decline Bench Press",
          keywords: ["lower chest", "pecs", "pressing"],
        },
        {
          name: "Decline Dumbbell Press",
          keywords: ["lower chest", "pecs", "pressing"],
        },
        {
          name: "Dips",
          keywords: ["lower chest", "pecs", "triceps", "bodyweight"],
        },
        {
          name: "Decline Push-Ups",
          keywords: ["lower chest", "pecs", "bodyweight"],
        },
      ],
      Machine: [
        {
          name: "Decline Smith Machine Press",
          keywords: ["lower chest", "pecs", "pressing", "machine"],
        },
        {
          name: "Chest Dip Machine",
          keywords: ["lower chest", "pecs", "triceps", "machine"],
        },
      ],
      Cable: [
        {
          name: "High-to-Low Cable Flyes",
          keywords: ["lower chest", "pecs", "flyes", "cable"],
        },
        {
          name: "Decline Cable Press",
          keywords: ["lower chest", "pecs", "pressing", "cable"],
        },
      ],
    },
  },
  Back: {
    "Upper Back": {
      Freeweight: [
        {
          name: "Pull-Ups",
          keywords: ["upper back", "lats", "biceps", "bodyweight"],
        },
        {
          name: "Chin-Ups",
          keywords: ["upper back", "lats", "biceps", "bodyweight"],
        },
        {
          name: "Prone Y Raises",
          keywords: ["upper back", "traps", "rear delts"],
        },
      ],
      Machine: [
        {
          name: "Lat Pulldowns",
          keywords: ["upper back", "lats", "biceps", "machine"],
        },
        {
          name: "Behind-the-Neck Pulldowns",
          keywords: ["upper back", "lats", "traps", "machine"],
        },
        {
          name: "Assisted Pull-Up Machine",
          keywords: ["upper back", "lats", "biceps", "machine"],
        },
      ],
      Cable: [
        {
          name: "Straight Arm Pulldowns",
          keywords: ["upper back", "lats", "cable"],
        },
        {
          name: "High Cable Rows",
          keywords: ["upper back", "lats", "rhomboids", "cable"],
        },
      ],
    },
    "Mid Back": {
      Freeweight: [
        { name: "Bent-Over Rows", keywords: ["mid back", "lats", "rhomboids"] },
        { name: "T-Bar Rows", keywords: ["mid back", "lats", "rhomboids"] },
        { name: "Meadows Rows", keywords: ["mid back", "lats", "rhomboids"] },
      ],
      Machine: [
        {
          name: "Seated Row Machine",
          keywords: ["mid back", "lats", "rhomboids", "machine"],
        },
        {
          name: "Chest-Supported Row Machine",
          keywords: ["mid back", "lats", "rhomboids", "machine"],
        },
      ],
      Cable: [
        {
          name: "Seated Cable Rows",
          keywords: ["mid back", "lats", "rhomboids", "cable"],
        },
        {
          name: "Face Pulls",
          keywords: ["mid back", "rear delts", "traps", "cable"],
        },
      ],
    },
    "Lower Back": {
      Freeweight: [
        {
          name: "Deadlifts",
          keywords: ["lower back", "erector spinae", "hamstrings", "glutes"],
        },
        {
          name: "Good Mornings",
          keywords: ["lower back", "erector spinae", "hamstrings"],
        },
        {
          name: "Superman Hold",
          keywords: ["lower back", "erector spinae", "bodyweight"],
        },
      ],
      Machine: [
        {
          name: "Back Extension Machine",
          keywords: ["lower back", "erector spinae", "machine"],
        },
        {
          name: "Reverse Hyper Machine",
          keywords: ["lower back", "erector spinae", "glutes", "machine"],
        },
      ],
      Cable: [
        {
          name: "Cable Pull-Throughs",
          keywords: ["lower back", "hamstrings", "glutes", "cable"],
        },
        {
          name: "Cable Good Mornings",
          keywords: ["lower back", "erector spinae", "hamstrings", "cable"],
        },
      ],
    },
  },
  Legs: {
    Quads: {
      Freeweight: [
        {
          name: "Back Squats",
          keywords: ["quads", "glutes", "hamstrings", "compound"],
        },
        { name: "Front Squats", keywords: ["quads", "core", "compound"] },
        {
          name: "Bulgarian Split Squats",
          keywords: ["quads", "glutes", "balance"],
        },
        {
          name: "Lunges",
          keywords: ["quads", "glutes", "hamstrings", "balance"],
        },
      ],
      Machine: [
        { name: "Leg Press", keywords: ["quads", "glutes", "machine"] },
        { name: "Hack Squats", keywords: ["quads", "glutes", "machine"] },
        {
          name: "Leg Extension Machine",
          keywords: ["quads", "isolation", "machine"],
        },
      ],
      Cable: [
        { name: "Cable Squats", keywords: ["quads", "glutes", "cable"] },
        {
          name: "Cable Lunges",
          keywords: ["quads", "glutes", "balance", "cable"],
        },
      ],
    },
    Hamstrings: {
      Freeweight: [
        {
          name: "Romanian Deadlifts",
          keywords: ["hamstrings", "glutes", "lower back"],
        },
        {
          name: "Stiff-Legged Deadlifts",
          keywords: ["hamstrings", "glutes", "lower back"],
        },
        { name: "Good Mornings", keywords: ["hamstrings", "lower back"] },
        {
          name: "Nordic Hamstring Curls",
          keywords: ["hamstrings", "bodyweight"],
        },
      ],
      Machine: [
        {
          name: "Seated Leg Curl Machine",
          keywords: ["hamstrings", "isolation", "machine"],
        },
        {
          name: "Lying Leg Curl Machine",
          keywords: ["hamstrings", "isolation", "machine"],
        },
        {
          name: "Glute-Ham Raise Machine",
          keywords: ["hamstrings", "glutes", "lower back", "machine"],
        },
      ],
      Cable: [
        {
          name: "Cable Leg Curls",
          keywords: ["hamstrings", "isolation", "cable"],
        },
        {
          name: "Cable Pull-Throughs",
          keywords: ["hamstrings", "glutes", "cable"],
        },
      ],
    },
    Glutes: {
      Freeweight: [
        { name: "Hip Thrusts", keywords: ["glutes", "hamstrings"] },
        { name: "Glute Bridges", keywords: ["glutes", "hamstrings"] },
        { name: "Step-Ups", keywords: ["glutes", "quads", "balance"] },
        { name: "Frog Pumps", keywords: ["glutes", "isolation"] },
      ],
      Machine: [
        {
          name: "Smith Machine Hip Thrusts",
          keywords: ["glutes", "hamstrings", "machine"],
        },
        {
          name: "Glute Kickback Machine",
          keywords: ["glutes", "isolation", "machine"],
        },
      ],
      Cable: [
        { name: "Cable Kickbacks", keywords: ["glutes", "isolation", "cable"] },
        {
          name: "Cable Pull-Throughs",
          keywords: ["glutes", "hamstrings", "cable"],
        },
      ],
    },
    Abductors: {
      Freeweight: [
        { name: "Side-Lying Leg Raises", keywords: ["abductors", "isolation"] },
        { name: "Clamshells", keywords: ["abductors", "isolation"] },
        { name: "Sumo Squats", keywords: ["abductors", "quads", "glutes"] },
      ],
      Machine: [
        {
          name: "Hip Abduction Machine",
          keywords: ["abductors", "isolation", "machine"],
        },
      ],
      Cable: [
        {
          name: "Cable Hip Abductions",
          keywords: ["abductors", "isolation", "cable"],
        },
        {
          name: "Banded Lateral Walks",
          keywords: ["abductors", "glutes", "resistance band"],
        },
      ],
    },
    Adductors: {
      Freeweight: [
        { name: "Adductor Lunges", keywords: ["adductors", "balance"] },
        {
          name: "Copenhagen Plank",
          keywords: ["adductors", "core", "bodyweight"],
        },
        { name: "Sumo Squats", keywords: ["adductors", "quads", "glutes"] },
      ],
      Machine: [
        {
          name: "Hip Adduction Machine",
          keywords: ["adductors", "isolation", "machine"],
        },
      ],
      Cable: [
        {
          name: "Cable Hip Adductions",
          keywords: ["adductors", "isolation", "cable"],
        },
        {
          name: "Cable Adductor Flyes",
          keywords: ["adductors", "isolation", "cable"],
        },
      ],
    },
  },
  Shoulders: {
    "Front Delts": {
      Freeweight: [
        {
          name: "Military Press",
          keywords: ["front delts", "shoulders", "pressing"],
        },
        {
          name: "Dumbbell Front Raises",
          keywords: ["front delts", "shoulders", "isolation"],
        },
        {
          name: "Arnold Press",
          keywords: ["front delts", "shoulders", "pressing"],
        },
      ],
      Machine: [
        {
          name: "Smith Machine Shoulder Press",
          keywords: ["front delts", "shoulders", "pressing", "machine"],
        },
        {
          name: "Hammer Strength Shoulder Press",
          keywords: ["front delts", "shoulders", "pressing", "machine"],
        },
      ],
      Cable: [
        {
          name: "Cable Front Raises",
          keywords: ["front delts", "shoulders", "isolation", "cable"],
        },
        {
          name: "High Cable Front Raises",
          keywords: ["front delts", "shoulders", "isolation", "cable"],
        },
      ],
    },
    "Side Delts": {
      Freeweight: [
        {
          name: "Lateral Raises",
          keywords: ["side delts", "shoulders", "isolation"],
        },
        {
          name: "Upright Rows",
          keywords: ["side delts", "traps", "shoulders"],
        },
        {
          name: "Leaning Lateral Raises",
          keywords: ["side delts", "shoulders", "isolation"],
        },
      ],
      Machine: [
        {
          name: "Machine Lateral Raises",
          keywords: ["side delts", "shoulders", "isolation", "machine"],
        },
        {
          name: "Smith Machine Upright Rows",
          keywords: ["side delts", "traps", "shoulders", "machine"],
        },
      ],
      Cable: [
        {
          name: "Cable Lateral Raises",
          keywords: ["side delts", "shoulders", "isolation", "cable"],
        },
        {
          name: "Cable Upright Rows",
          keywords: ["side delts", "traps", "shoulders", "cable"],
        },
      ],
    },
    "Rear Delts": {
      Freeweight: [
        {
          name: "Reverse Flyes",
          keywords: ["rear delts", "shoulders", "isolation"],
        },
        {
          name: "Bent-Over Lateral Raises",
          keywords: ["rear delts", "shoulders", "isolation"],
        },
        {
          name: "Face Pulls with External Rotation",
          keywords: ["rear delts", "rotator cuff", "shoulders"],
        },
      ],
      Machine: [
        {
          name: "Reverse Pec Deck",
          keywords: ["rear delts", "shoulders", "isolation", "machine"],
        },
        {
          name: "Rear Delt Machine",
          keywords: ["rear delts", "shoulders", "isolation", "machine"],
        },
      ],
      Cable: [
        {
          name: "Face Pulls",
          keywords: ["rear delts", "traps", "shoulders", "cable"],
        },
        {
          name: "Reverse Cable Flyes",
          keywords: ["rear delts", "shoulders", "isolation", "cable"],
        },
      ],
    },
  },
  Arms: {
    Biceps: {
      Freeweight: [
        { name: "Barbell Curls", keywords: ["biceps", "arms", "curling"] },
        { name: "Dumbbell Curls", keywords: ["biceps", "arms", "curling"] },
        {
          name: "Hammer Curls",
          keywords: ["biceps", "forearms", "arms", "curling"],
        },
        {
          name: "Preacher Curls",
          keywords: ["biceps", "arms", "curling", "isolation"],
        },
      ],
      Machine: [
        {
          name: "Machine Bicep Curls",
          keywords: ["biceps", "arms", "curling", "machine"],
        },
        {
          name: "Smith Machine Drag Curls",
          keywords: ["biceps", "arms", "curling", "machine"],
        },
      ],
      Cable: [
        {
          name: "Cable Curls",
          keywords: ["biceps", "arms", "curling", "cable"],
        },
        {
          name: "High Cable Curls",
          keywords: ["biceps", "arms", "curling", "cable"],
        },
      ],
    },
    Triceps: {
      Freeweight: [
        {
          name: "Close-Grip Bench Press",
          keywords: ["triceps", "chest", "arms", "pressing"],
        },
        { name: "Skull Crushers", keywords: ["triceps", "arms", "isolation"] },
        {
          name: "Overhead Tricep Extensions",
          keywords: ["triceps", "arms", "isolation"],
        },
        {
          name: "Diamond Push-Ups",
          keywords: ["triceps", "chest", "arms", "bodyweight"],
        },
      ],
      Machine: [
        {
          name: "Tricep Pushdown Machine",
          keywords: ["triceps", "arms", "isolation", "machine"],
        },
        {
          name: "Assisted Dip Machine",
          keywords: ["triceps", "chest", "arms", "machine"],
        },
      ],
      Cable: [
        {
          name: "Tricep Pushdowns",
          keywords: ["triceps", "arms", "isolation", "cable"],
        },
        {
          name: "Overhead Cable Tricep Extensions",
          keywords: ["triceps", "arms", "isolation", "cable"],
        },
      ],
    },
  },
};

const ExerciseDropdown = ({ placeholder, onSelectExercise }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    placeholder || "Select an exercise"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState(exerciseData);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (searchTerm) {
        const filtered = Object.keys(exerciseData).reduce((acc, category) => {
          const filteredSubcategories = Object.keys(
            exerciseData[category]
          ).reduce((subAcc, subcategory) => {
            const filteredEquipment = Object.keys(
              exerciseData[category][subcategory]
            ).reduce((eqAcc, equipment) => {
              const exercises = exerciseData[category][subcategory][equipment];
              if (!Array.isArray(exercises)) {
                console.error(
                  `Exercises for ${category} > ${subcategory} > ${equipment} is not an array:`,
                  exercises
                );
                return eqAcc;
              }
              const matchingExercises = exercises.filter(
                (exercise) =>
                  exercise.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  exercise.keywords.some((keyword) =>
                    keyword.toLowerCase().includes(searchTerm.toLowerCase())
                  ) ||
                  category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  subcategory
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  equipment.toLowerCase().includes(searchTerm.toLowerCase())
              );
              if (matchingExercises.length > 0) {
                eqAcc[equipment] = matchingExercises;
              }
              return eqAcc;
            }, {});
            if (Object.keys(filteredEquipment).length > 0) {
              subAcc[subcategory] = filteredEquipment;
            }
            return subAcc;
          }, {});
          if (Object.keys(filteredSubcategories).length > 0) {
            acc[category] = filteredSubcategories;
          }
          return acc;
        }, {});
        setFilteredExercises(filtered);
      } else {
        setFilteredExercises(exerciseData);
      }
      setError(null);
    } catch (err) {
      console.error("Error in filtering exercises:", err);
      setError("An error occurred while filtering exercises.");
    }
  }, [searchTerm]);

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsVisible(false);
    onSelectExercise(value);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const renderExercises = (exercises, equipmentType) => {
    if (!Array.isArray(exercises)) {
      console.error(
        `Exercises for ${equipmentType} is not an array:`,
        exercises
      );
      return null;
    }
    return exercises.map((exercise) => (
      <TouchableOpacity
        key={exercise.name}
        onPress={() => handleSelect(exercise.name)}
        style={styles.option}
      >
        <Text style={styles.optionText}>{exercise.name}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
        <Text style={styles.selectedValue}>{selectedValue}</Text>
        <Icon
          name={isVisible ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color="#4CAF50"
        />
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.dropdownContent}>
          <View style={styles.searchInputContainer}>
            <Icon
              name="search-outline"
              size={20}
              color="#4CAF50"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor="#666"
              value={searchTerm}
              onChangeText={handleSearch}
            />
          </View>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <ScrollView style={styles.scrollView}>
              {Object.entries(filteredExercises).map(
                ([category, subcategories]) => (
                  <View key={category}>
                    <Text style={styles.categoryHeader}>{category}</Text>
                    {Object.entries(subcategories).map(
                      ([subcategory, equipment]) => (
                        <View key={subcategory}>
                          <Text style={styles.subcategoryHeader}>
                            {subcategory}
                          </Text>
                          {Object.entries(equipment).map(
                            ([equipmentType, exercises]) => (
                              <View key={equipmentType}>
                                <Text style={styles.equipmentHeader}>
                                  {equipmentType}
                                </Text>
                                {renderExercises(exercises, equipmentType)}
                              </View>
                            )
                          )}
                        </View>
                      )
                    )}
                  </View>
                )
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedValue: {
    fontSize: 16,
    color: "#fff",
  },
  dropdownContent: {
    marginTop: 10,
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    maxHeight: Dimensions.get("window").height * 0.6,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#fff",
  },
  scrollView: {
    flexGrow: 1,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#4CAF50",
  },
  subcategoryHeader: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
    paddingLeft: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#2196F3",
  },
  equipmentHeader: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 6,
    paddingLeft: 30,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    color: "#FFC107",
  },
  option: {
    padding: 10,
    paddingLeft: 40,
  },
  optionText: {
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    color: "#FF5252",
    padding: 10,
  },
});

export default ExerciseDropdown;
