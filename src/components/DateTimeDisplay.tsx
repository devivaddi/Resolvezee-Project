"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { useDispatch } from "react-redux"
import { updateDateTime } from "../store/slices/appSlice"

const DateTimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      dispatch(updateDateTime())
    }, 1000)

    return () => clearInterval(timer)
  }, [dispatch])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
      <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  timeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
  },
})

export default DateTimeDisplay
