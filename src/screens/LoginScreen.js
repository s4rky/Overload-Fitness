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
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, fetchCsrfToken } from "./utils/auth";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchCsrfToken().catch((error) => {
      console.error("Error fetching CSRF token:", error);
    });

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const data = await login(username, password);
      await AsyncStorage.setItem("csrfToken", data.csrfToken);
      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("nickname", data.nickname || username);
      navigation.navigate("Home", { username: username });
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
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
            <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>
              <View style={styles.logoContainer}>
                <Icon name="barbell-outline" size={80} color="#3498db" />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Overload</Text>
                <Text style={styles.subtitle}>
                  Log in to start your workout
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
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={["#f39c12", "#e67e22"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => navigation.navigate("Signup")}
                >
                  <Text style={styles.linkButtonText}>
                    Don't have an account?{" "}
                    <Text style={styles.signUpText}>Sign up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
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
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(52, 152, 219, 0.5)",
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
  signUpText: {
    color: "#3498db",
    fontWeight: "bold",
  },
});

export default LoginScreen;
