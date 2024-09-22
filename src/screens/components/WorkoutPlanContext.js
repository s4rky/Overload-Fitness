import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  fetchLatestWeekPlan,
  saveWeekPlan,
  fetchAllWeekPlans,
} from "../utils/auth";

const WorkoutPlanContext = createContext();

export const WorkoutPlanProvider = ({ children }) => {
  const [weekPlan, setWeekPlan] = useState(null);
  const [allWeekPlans, setAllWeekPlans] = useState([]);
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
      // After saving, update the list of all week plans
      await loadAllWeekPlans();
    } catch (error) {
      console.error("Error saving week plan:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAllWeekPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const plans = await fetchAllWeekPlans();
      setAllWeekPlans(plans);
    } catch (error) {
      console.error("Error fetching all week plans:", error);
      setAllWeekPlans([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeekPlan();
    loadAllWeekPlans();
  }, [loadWeekPlan, loadAllWeekPlans]);

  const value = {
    weekPlan,
    allWeekPlans,
    isLoading,
    loadWeekPlan,
    updateWeekPlan,
    loadAllWeekPlans,
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
