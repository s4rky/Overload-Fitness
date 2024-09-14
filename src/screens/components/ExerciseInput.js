import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SET_WIDTH = SCREEN_WIDTH * 0.6;
const ITEM_SPACING = 10;

const ExerciseInput = () => {
  const [numSets, setNumSets] = useState("");
  const [sets, setSets] = useState([]);
  const [isKg, setIsKg] = useState(true);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const flatListRef = useRef(null);

  const updateSetCount = (value) => {
    const count = parseInt(value) || 0;
    setNumSets(value);
    setSets(
      Array(count)
        .fill()
        .map(() => ({ reps: "", weight: "", isWarmup: false }))
    );
  };

  const updateSet = (index, field, value) => {
    setSets((prevSets) => {
      const newSets = [...prevSets];
      newSets[index] = { ...newSets[index], [field]: value };
      return newSets;
    });
  };

  const toggleUnit = () => setIsKg(!isKg);

  const renderSetItem = ({ item, index }) => (
    <View style={styles.setContainer}>
      <Text style={styles.setLabel}>Set {index + 1}</Text>
      <View style={styles.setInputs}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reps</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="repeat-outline"
              size={20}
              color="#4CAF50"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#888"
              placeholder="0"
              value={item.reps}
              onChangeText={(value) => updateSet(index, "reps", value)}
            />
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.weightInputWrapper}>
            <Icon
              name="barbell-outline"
              size={20}
              color="#4CAF50"
              style={styles.icon}
            />
            <TextInput
              style={styles.weightInput}
              keyboardType="numeric"
              placeholderTextColor="#888"
              placeholder="0"
              value={item.weight}
              onChangeText={(value) => updateSet(index, "weight", value)}
            />
            <TouchableOpacity onPress={toggleUnit} style={styles.unitToggle}>
              <Text style={styles.unitText}>{isKg ? "kg" : "lbs"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.warmupButton,
          item.isWarmup && styles.warmupButtonActive,
        ]}
        onPress={() => updateSet(index, "isWarmup", !item.isWarmup)}
      >
        <Text style={styles.warmupButtonText}>
          {item.isWarmup ? "Warmup" : "Working Set"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Number of Sets</Text>
        <View style={styles.inputWrapper}>
          <Icon
            name="fitness-outline"
            size={20}
            color="#4CAF50"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholderTextColor="#888"
            placeholder="0"
            value={numSets}
            onChangeText={updateSetCount}
          />
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={sets}
        renderItem={renderSetItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SET_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
        ItemSeparatorComponent={() => <View style={{ width: ITEM_SPACING }} />}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (SET_WIDTH + ITEM_SPACING)
          );
          setCurrentSetIndex(index);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  flatList: {
    width: SCREEN_WIDTH,
  },
  flatListContent: {
    paddingHorizontal: (SCREEN_WIDTH - SET_WIDTH) / 2,
  },
  setContainer: {
    width: SET_WIDTH,
    padding: 15,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  inputGroup: {
    marginBottom: 15,
    width: "100%",
  },
  setInputs: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#bbb",
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  weightInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    minWidth: 50,
  },
  weightInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    minWidth: 50,
  },
  unitToggle: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "stretch",
    justifyContent: "center",
  },
  unitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  setLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  warmupButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  warmupButtonActive: {
    backgroundColor: "rgba(76, 175, 80, 0.6)",
  },
  warmupButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ExerciseInput;
