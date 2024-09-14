import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchLatestWeekPlan, saveWeekPlan } from "../utils/auth";

const WorkoutPlanContext = createContext();

export const WorkoutPlanProvider = ({ children }) => {
  const [weekPlan, setWeekPlan] = useState(null);

  const fetchWeekPlan = async () => {
    try {
      const latestPlan = await fetchLatestWeekPlan();
      if (latestPlan && latestPlan.data) {
        setWeekPlan(latestPlan.data);
      }
    } catch (error) {
      console.error("Error fetching week plan:", error);
    }
  };

  const updateWeekPlan = async (newPlan) => {
    try {
      await saveWeekPlan(newPlan);
      setWeekPlan(newPlan);
    } catch (error) {
      console.error("Error saving week plan:", error);
    }
  };

  useEffect(() => {
    fetchWeekPlan();
  }, []);

  return (
    <WorkoutPlanContext.Provider
      value={{ weekPlan, fetchWeekPlan, updateWeekPlan }}
    >
      {children}
    </WorkoutPlanContext.Provider>
  );
};

export const useWorkoutPlan = () => useContext(WorkoutPlanContext);
