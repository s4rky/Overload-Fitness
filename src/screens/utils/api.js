import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiCall = async (url, method = "GET", body = null) => {
  const csrfToken = await AsyncStorage.getItem("csrfToken");

  const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
  };

  const options = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API call failed:", errorText);
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
