"use client"

import type React from "react"
import { useEffect } from "react"
import { View, Text, StyleSheet, Dimensions, StatusBar } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/MaterialIcons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../navigation/types"

const { width, height } = Dimensions.get("window")

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, "Splash">

interface Props {
  navigation: SplashScreenNavigationProp
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home")
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <StatusBar hidden />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Icon name="security" size={120} color="#FFFFFF" />
        </View>
        <Text style={styles.appName}>Health and Safety App</Text>
        <Text style={styles.tagline}>Keeping Your Workplace Safe</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: "#E8E8E8",
    textAlign: "center",
    marginBottom: 60,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
  },
  loadingText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
  },
})

export default SplashScreen
