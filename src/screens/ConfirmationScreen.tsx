import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native"
import { useSelector, useDispatch } from "react-redux"
import LinearGradient from "react-native-linear-gradient"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { resetCurrentTicket } from "../store/slices/ticketSlice";
//import { updateTimer, resetTicket } from "../store/slices/ticketSlice";
import { clearReportState } from "../store/slices/reportSlice"
import type { RootState } from "../store/store"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../navigation/types"

const { width, height } = Dimensions.get("window")

type ConfirmationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Confirmation"
>

type Props = {
  navigation: ConfirmationScreenNavigationProp
}

const ConfirmationScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch()
  const [countdown, setCountdown] = useState(5)

  // ✅ Move these OUTSIDE useEffect
  const currentTicketId = useSelector((state: RootState) => state.report.currentTicketId)
  const assignedStaff = useSelector((state: RootState) => state.report.assignedStaff)
  const slaTimeRemaining = useSelector((state: RootState) => state.report.slaTimeRemaining)
  const totalIssuesRaised = useSelector((state: RootState) => state.report.totalIssuesRaised)
  const selectedIncident = useSelector((state: RootState) => state.report.selectedIncident as { name?: string } | null)
  const selectedSubcategory = useSelector((state: RootState) => state.report.selectedSubcategory as { name?: string } | null)
useEffect(() => {
  // Remove or replace this if you don't have an updateTimer action
  // const slaTimer = setInterval(() => {
  //   dispatch(updateTimer())
  // }, 1000)

  const countdownTimer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        dispatch(resetCurrentTicket()) // <-- Use the correct action
        dispatch(clearReportState())
        navigation.replace("Home")
        return 0
      }
      return prev - 1
    })
  }, 1000)

  return () => {
    // clearInterval(slaTimer) // Remove if not used
    clearInterval(countdownTimer)
  }
}, [dispatch, navigation])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <LinearGradient colors={["#28a745", "#20c997"]} style={styles.container}>
      <StatusBar hidden />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="check-circle" size={120} color="#FFFFFF" />
        </View>

        <Text style={styles.successTitle}>Report Submitted Successfully!</Text>
        <Text style={styles.successSubtitle}>
          Your incident has been logged and assigned to our safety team
        </Text>

        <View style={styles.ticketContainer}>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Ticket ID:</Text>
            <Text style={styles.ticketValue}>{currentTicketId}</Text>
          </View>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Incident Type:</Text>
            <Text style={styles.ticketValue}>
              {selectedIncident?.name} - {selectedSubcategory?.name}
            </Text>
          </View>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Assigned to:</Text>
            <Text style={styles.ticketValue}>{assignedStaff}</Text>
          </View>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>SLA Time Remaining:</Text>
            <Text style={[styles.ticketValue, styles.slaTime]}>
              {formatTime(slaTimeRemaining)}
            </Text>
          </View>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Total Issues Today:</Text>
            <Text style={styles.ticketValue}>{totalIssuesRaised}</Text>
          </View>
        </View>

        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            Returning to home screen in {countdown} seconds...
          </Text>
        </View>
      </View>
    </LinearGradient>
  )
}

export default ConfirmationScreen

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
  iconContainer: {
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 15,
  },
  successSubtitle: {
    fontSize: 18,
    color: "#E8F5E8",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  ticketContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    maxWidth: 600,
    marginBottom: 40,
  },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  ticketLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    flex: 1,
  },
  ticketValue: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  slaTime: {
    color: "#DC3545",
    fontWeight: "bold",
  },
  countdownContainer: {
    position: "absolute",
    bottom: 50,
  },
  countdownText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
  },
})
