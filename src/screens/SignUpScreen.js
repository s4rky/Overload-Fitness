import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiCall } from "./utils/api";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const response = await apiCall(
        "http://192.168.2.50:8000/api/get-csrf-token/"
      );
      await AsyncStorage.setItem("csrfToken", response.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiCall(
        "http://192.168.2.50:8000/api/users/",
        "POST",
        { username, email, password, nickname }
      );

      if (response) {
        alert("Signup successful. Please log in.");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.inner}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>
                    Join us and start your fitness journey
                  </Text>
                </View>
                <View style={styles.formContainer}>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="person-outline"
                      size={20}
                      color="#4CAF50"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor="#666"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="mail-outline"
                      size={20}
                      color="#4CAF50"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#666"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="happy-outline"
                      size={20}
                      color="#4CAF50"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nickname"
                      placeholderTextColor="#666"
                      value={nickname}
                      onChangeText={setNickname}
                      autoCapitalize="words"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="lock-closed-outline"
                      size={20}
                      color="#4CAF50"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#666"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="shield-checkmark-outline"
                      size={20}
                      color="#4CAF50"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor="#666"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignup}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={["#4CAF50", "#45a049"]}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>
                        {isLoading ? "Signing up..." : "Sign Up"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.linkButtonText}>
                      Already have an account? Log in
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  inner: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#bbb",
    textAlign: "center",
    marginTop: 10,
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginBottom: 20,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#fff",
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkButtonText: {
    color: "#4CAF50",
    fontSize: 16,
  },
});

export default SignupScreen;
