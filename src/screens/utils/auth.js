import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.0.0.117:8000/api";

export const fetchCsrfToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get-csrf-token/`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    await AsyncStorage.setItem("csrfToken", data.csrfToken);
    return data.csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw error;
  }
};

export const login = async (username, password) => {
  const csrfToken = await fetchCsrfToken();
  const response = await fetch(`${BASE_URL}/users/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  await AsyncStorage.setItem("csrfToken", data.csrfToken);
  await AsyncStorage.setItem("username", username);
  await AsyncStorage.setItem("nickname", data.nickname || username);
  return data;
};

export const logout = async () => {
  const csrfToken = await fetchCsrfToken();
  await fetch(`${BASE_URL}/users/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    credentials: "include",
  });
  await AsyncStorage.removeItem("csrfToken");
  await AsyncStorage.removeItem("username");
  await AsyncStorage.removeItem("nickname");
};

export const saveWeekPlan = async (planData) => {
  const csrfToken = await fetchCsrfToken();
  const response = await fetch(`${BASE_URL}/weekplans/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(planData), // Now sending the entire planData object
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to save week plan");
  }

  return response.json();
};

export const fetchLatestWeekPlan = async () => {
  const csrfToken = await fetchCsrfToken();
  const response = await fetch(`${BASE_URL}/weekplans/latest/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No week plan found
    }
    throw new Error("Failed to fetch latest week plan");
  }

  return response.json();
};
