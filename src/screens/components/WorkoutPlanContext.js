import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { fetchLatestWeekPlan, saveWeekPlan } from "../utils/auth";

const WorkoutPlanContext = createContext();

export const WorkoutPlanProvider = ({ children }) => {
  const [weekPlan, setWeekPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWeekPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const latestPlan = await fetchLatestWeekPlan();
      if (latestPlan && latestPlan.data) {
        setWeekPlan(latestPlan.data);
      } else {
        setWeekPlan(null);
      }
    } catch (error) {
      console.error("Error fetching week plan:", error);
      setWeekPlan(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateWeekPlan = useCallback(async (newPlan) => {
    setIsLoading(true);
    try {
      await saveWeekPlan(newPlan);
      setWeekPlan(newPlan);
    } catch (error) {
      console.error("Error saving week plan:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeekPlan();
  }, [loadWeekPlan]);

  const value = {
    weekPlan,
    isLoading,
    loadWeekPlan,
    updateWeekPlan,
  };

  return (
    <WorkoutPlanContext.Provider value={value}>
      {children}
    </WorkoutPlanContext.Provider>
  );
};

export const useWorkoutPlan = () => {
  const context = useContext(WorkoutPlanContext);
  if (context === undefined) {
    throw new Error("useWorkoutPlan must be used within a WorkoutPlanProvider");
  }
  return context;
};
