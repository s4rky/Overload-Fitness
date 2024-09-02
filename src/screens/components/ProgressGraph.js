import React from "react";
import { View, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const ProgressGraph = () => {
  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          datasets: [
            {
              data: [50, 80, 90, 70],
            },
          ],
        }}
        width={screenWidth - 40} // Make sure this width is less than the container width
        height={220}
        yAxisLabel=""
        yAxisSuffix="%"
        chartConfig={{
          backgroundColor: "#1F2C40",
          backgroundGradientFrom: "#2C3E50",
          backgroundGradientTo: "#4A5568",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#6B7280",
          },
        }}
        bezier
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20, // Adjust this if needed
    paddingVertical: 20, // Adjust this if needed
  },
});

export default ProgressGraph;
