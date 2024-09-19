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
  deleteWeekPlan as apiDeleteWeekPlan,
  fetchWeekPlanById,
  updateWeekPlan as apiUpdateWeekPlan,
} from "../utils/auth";

const WorkoutPlanContext = createContext();

export const WorkoutPlanProvider = ({ children }) => {
  const [weekPlan, setWeekPlan] = useState(null);
  const [allWeekPlans, setAllWeekPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeekPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const latestPlan = await fetchLatestWeekPlan();
      if (latestPlan && latestPlan.data) {
        setWeekPlan(latestPlan.data);
      }
    } catch (error) {
      console.error("Error fetching week plan:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const plans = await fetchAllWeekPlans();
      setAllWeekPlans(plans);
    } catch (error) {
      console.error("Error fetching all week plans:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateWeekPlan = useCallback(async (planData) => {
    setIsLoading(true);
    try {
      const dataToSave = {
        ...planData,
        data: planData.days,
      };
      delete dataToSave.days;

      console.log(
        "Data being sent to API:",
        JSON.stringify(dataToSave, null, 2)
      );

      let savedPlan;
      if (planData.id) {
        savedPlan = await apiUpdateWeekPlan(dataToSave);
      } else {
        savedPlan = await saveWeekPlan(dataToSave);
      }

      console.log("Saved plan:", JSON.stringify(savedPlan, null, 2));

      // Immediately update local state
      setWeekPlan(savedPlan);
      setAllWeekPlans((prevPlans) => {
        const index = prevPlans.findIndex((plan) => plan.id === savedPlan.id);
        if (index !== -1) {
          // Replace existing plan
          return prevPlans.map((plan) =>
            plan.id === savedPlan.id ? savedPlan : plan
          );
        } else {
          // Add new plan
          return [...prevPlans, savedPlan];
        }
      });

      return savedPlan;
    } catch (error) {
      console.error("Error saving/updating week plan:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteWeekPlan = useCallback(
    async (planId) => {
      setIsLoading(true);
      try {
        await apiDeleteWeekPlan(planId);

        // Immediately update local state
        setAllWeekPlans((prevPlans) =>
          prevPlans.filter((plan) => plan.id !== planId)
        );
        if (weekPlan && weekPlan.id === planId) {
          setWeekPlan(null);
        }
      } catch (error) {
        console.error("Error deleting week plan:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [weekPlan]
  );

  const fetchPlanById = useCallback(async (planId) => {
    setIsLoading(true);
    try {
      const plan = await fetchWeekPlanById(planId);
      return plan;
    } catch (error) {
      console.error("Error fetching week plan by ID:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeekPlan();
    fetchAllPlans();
  }, [fetchWeekPlan, fetchAllPlans]);

  const value = {
    weekPlan,
    allWeekPlans,
    isLoading,
    fetchWeekPlan,
    fetchAllPlans,
    updateWeekPlan,
    deleteWeekPlan,
    fetchPlanById,
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
