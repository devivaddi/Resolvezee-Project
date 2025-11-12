"use client"

import type React from "react"
import { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store/store"
import { nextSafetyTip } from "../store/slices/appSlice"
import Icon from "react-native-vector-icons/MaterialIcons"

const SafetyTipsDisplay: React.FC = () => {
  const safetyTip = useSelector((state: RootState) => state.safety.todayStats.safetyTip)
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(nextSafetyTip())
    }, 10000) // Change tip every 10 seconds

    return () => clearInterval(timer)
  }, [dispatch])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="lightbulb-outline" size={24} color="#F39C12" />
        <Text style={styles.headerText}>Safety Tip</Text>
      </View>
      <Text style={styles.tipText}>{safetyTip}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF9E6",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#F39C12",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F39C12",
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#2C3E50",
    lineHeight: 20,
  },
})

export default SafetyTipsDisplay
