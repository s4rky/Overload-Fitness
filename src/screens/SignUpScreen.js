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
  Animated,
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
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchCsrfToken();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const response = await apiCall(
        "http://10.0.0.117:8000/api/get-csrf-token/"
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
              <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>
                <View style={styles.logoContainer}>
                  <Icon name="fitness-outline" size={80} color="#3498db" />
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Join Overload</Text>
                  <Text style={styles.subtitle}>
                    Start your fitness journey today
                  </Text>
                </View>
                <View style={styles.formContainer}>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="person-outline"
                      size={20}
                      color="#3498db"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor="#999"
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
                      color="#3498db"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#999"
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
                      color="#3498db"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nickname"
                      placeholderTextColor="#999"
                      value={nickname}
                      onChangeText={setNickname}
                      autoCapitalize="words"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="lock-closed-outline"
                      size={20}
                      color="#3498db"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="shield-checkmark-outline"
                      size={20}
                      color="#3498db"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor="#999"
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
                      colors={["#f39c12", "#e67e22"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
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
                      Already have an account?{" "}
                      <Text style={styles.loginText}>Log in</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
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
    padding: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(52, 152, 219, 0.5)", // Updated to blue
  },
  inputIcon: {
    padding: 10,
  },
  button: {
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    color: "#bbb",
    fontSize: 16,
  },
  loginText: {
    color: "#3498db", // Updated to blue
    fontWeight: "bold",
  },
});

export default SignupScreen;
