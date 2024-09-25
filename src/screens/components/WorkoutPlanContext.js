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
  deleteWeekPlan,
  updateWeekPlan as updateWeekPlanApi,
} from "../utils/auth";

const WorkoutPlanContext = createContext();

export const WorkoutPlanProvider = ({ children }) => {
  const [weekPlan, setWeekPlan] = useState(null);
  const [selectedWeekPlan, setSelectedWeekPlan] = useState(null);
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

  const selectWeekPlan = useCallback((plan) => {
    console.log("Selecting week plan in context:", plan);
    const formattedPlan = {
      name: plan.name,
      ...plan.data, // Spread the data object directly
    };
    console.log("Formatted plan:", formattedPlan);
    setSelectedWeekPlan(formattedPlan);
  }, []);

  useEffect(() => {
    console.log("Selected week plan updated:", selectedWeekPlan);
  }, [selectedWeekPlan]);

  const updateWeekPlan = useCallback(
    async (newPlan) => {
      setIsLoading(true);
      try {
        const savedPlan = await saveWeekPlan(newPlan);
        console.log("Saved plan:", savedPlan);

        // Format the saved plan to match the expected structure
        const formattedPlan = {
          name: savedPlan.name,
          ...savedPlan.data,
        };

        setWeekPlan(formattedPlan);
        setSelectedWeekPlan(formattedPlan); // Set the newly created plan as the selected plan
        await loadAllWeekPlans();
      } catch (error) {
        console.error("Error saving week plan:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [loadAllWeekPlans]
  );

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

  const deletePlan = useCallback(
    async (planId) => {
      setIsLoading(true);
      try {
        await deleteWeekPlan(planId);
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

  const updatePlan = useCallback(
    async (planId, updatedPlan) => {
      setIsLoading(true);
      try {
        const updated = await updateWeekPlanApi(planId, updatedPlan);
        setAllWeekPlans((prevPlans) =>
          prevPlans.map((plan) => (plan.id === planId ? updated : plan))
        );
        if (weekPlan && weekPlan.id === planId) {
          setWeekPlan(updated);
        }
      } catch (error) {
        console.error("Error updating week plan:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [weekPlan]
  );

  useEffect(() => {
    loadWeekPlan();
    loadAllWeekPlans();
  }, [loadWeekPlan, loadAllWeekPlans]);

  const value = {
    weekPlan,
    selectedWeekPlan,
    setSelectedWeekPlan,
    selectWeekPlan,
    allWeekPlans,
    isLoading,
    loadWeekPlan,
    updateWeekPlan,
    loadAllWeekPlans,
    deletePlan,
    updatePlan,
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
