"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
  Share,
  Alert,
  Linking,
} from "react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"
import { useAppSelector, useAppDispatch } from "../hooks/redux"
import type { RootStackParamList } from "../types/navigation"
import { updateTicketTimer } from "../store/slices/ticketSlice"
import Icon from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AnimatedProgressBar from "../components/AnimatedPrograssBar"
import PulsingDot from "../components/PlusingDot"
import FloatingActionButton from "../components/FloatingActionButton"
import AnimatedCard from "../components/AnimatedCard"

type TicketSuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "TicketSuccess">

type TicketSuccessScreenRouteProp = RouteProp<RootStackParamList, "TicketSuccess">

interface Props {
  navigation: TicketSuccessScreenNavigationProp
  route: TicketSuccessScreenRouteProp
}

const { width } = Dimensions.get("window")

const EnhancedTicketSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { ticketId } = route.params
  const dispatch = useAppDispatch()
  const { currentTicket } = useAppSelector((state) => state.ticket)
  const { selectedCategory, selectedSubcategory } = useAppSelector((state) => state.incident)

  const [timeElapsed, setTimeElapsed] = useState(94) // 1:34
  const [timeRemaining, setTimeRemaining] = useState(14306) // 3:58:26
  const [, setShowCelebration] = useState(true)

  // Animation refs
  const celebrationAnim = useRef(new Animated.Value(0)).current
  const headerAnim = useRef(new Animated.Value(-100)).current
  const bounceAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Initial animations
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start()

    // Celebration animation
    let celebrationLoop: Animated.CompositeAnimation | null = null
    
    if (celebrationAnim) {
      celebrationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(celebrationAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(celebrationAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      )
      celebrationLoop.start()
    }

    // Timer
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
      setTimeRemaining((prev) => Math.max(0, prev - 1))
      dispatch(updateTicketTimer())
    }, 1000)

    // Hide celebration after 3 seconds
    setTimeout(() => setShowCelebration(false), 3000)

    return () => {
      clearInterval(timer)
      if (celebrationLoop) {
        celebrationLoop.stop()
      }
      // Remove the bounceAnim.stop() as it's not a valid method on Animated.Value
    }
  }, [bounceAnim, celebrationAnim, headerAnim, dispatch])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getSLAProgress = () => {
    const totalSLA = 14400 // 4 hours
    return ((totalSLA - timeRemaining) / totalSLA) * 100
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "#DC2626"
      case "High":
        return "#EF4444"
      case "Medium":
        return "#F59E0B"
      case "Low":
        return "#10B981"
      default:
        return "#EF4444"
    }
  }

  const handleBackToCategories = () => {
    navigation.navigate("IncidentCategory")
  }

  const handleViewDetails = () => {
    Alert.alert(
      "Detailed Report",
      "Opening comprehensive incident report with photos, timeline, and investigation notes.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open", onPress: () => console.log("Opening detailed view") },
      ],
    )
  }

  const handleDownload = async () => {
    Alert.alert("Download Report", "Choose download format:", [
      { text: "Cancel", style: "cancel" },
      { text: "PDF Report", onPress: () => downloadPDF() },
      { text: "Excel Data", onPress: () => downloadExcel() },
      { text: "Photos & Media", onPress: () => downloadMedia() },
    ])
  }

  const downloadPDF = () => {
    Alert.alert("Success", "PDF report downloaded to your device")
  }

  const downloadExcel = () => {
    Alert.alert("Success", "Excel data exported successfully")
  }

  const downloadMedia = () => {
    Alert.alert("Success", "Photos and media files downloaded")
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ticket: ${currentTicket?.id || 'N/A'}`,
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to share ticket')
    }
  }

  const handleCallEmergency = () => {
    Alert.alert("Emergency Contact", "Call emergency services?", [
      { text: "Cancel", style: "cancel" },
      { text: "Call 911", onPress: () => Linking.openURL("tel:911") },
    ])
  }

  const handleContactAssignee = () => {
    Alert.alert("Contact Emily Chen", "How would you like to contact the assigned safety officer?", [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => Linking.openURL("tel:+1234567890") },
      { text: "Email", onPress: () => Linking.openURL("mailto:emily.chen@company.com") },
      { text: "Teams Chat", onPress: () => console.log("Opening Teams") },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerAnim }] }]}>
        <View style={styles.statusBar}>
          <Text style={styles.timeText}>5:04</Text>
          <View style={styles.signalContainer}>
            <View style={styles.signalBars}>
              <View style={[styles.bar, styles.bar1]} />
              <View style={[styles.bar, styles.bar2]} />
              <View style={[styles.bar, styles.bar3]} />
              <View style={[styles.bar, styles.bar4]} />
            </View>
            <Text style={styles.networkText}>5G</Text>
            <Icon name="battery-full" size={20} color="#10B981" />
          </View>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={handleBackToCategories}>
          <Icon name="arrow-back" size={20} color="#6B7280" />
          <Text style={styles.backButtonText}>Back to Categories</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Animated Success Banner */}
        <AnimatedCard delay={200} style={styles.successBanner}>
          <View style={styles.successContent}>
            <Animated.View
              style={[
                styles.successIconContainer,
                {
                  transform: [
                    {
                      scale: bounceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <MaterialCommunityIcons name="check-circle" size={32} color="#10B981" />
              <View style={styles.successRipple}>
                <Animated.View
                  style={[
                    styles.ripple,
                    {
                      transform: [
                        {
                          scale: celebrationAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 2],
                          }),
                        },
                      ],
                      opacity: celebrationAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0.3, 0],
                      }),
                    },
                  ]}
                />
              </View>
            </Animated.View>
            <View style={styles.successTextContainer}>
              <Text style={styles.successTitle}>Incident Report Created</Text>
              <Text style={styles.successSubtitle}>Your safety incident has been logged and assigned for review</Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Enhanced Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <FloatingActionButton
            onPress={handleViewDetails}
            icon="visibility"
            label="View Details"
            backgroundColor="#3B82F6"
            delay={400}
          />
          <FloatingActionButton
            onPress={handleDownload}
            icon="download"
            label="Download"
            backgroundColor="#8B5CF6"
            delay={600}
          />
          <FloatingActionButton
            onPress={handleShare}
            icon="share"
            label="Share"
            backgroundColor="#10B981"
            delay={800}
          />
        </View>

        {/* Main Content Cards */}
        <View style={styles.mainContent}>
          {/* Enhanced Incident Details Card */}
          <AnimatedCard delay={1000} style={styles.detailsCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="clipboard-text" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.cardTitle}>Incident Details</Text>
              <View style={styles.cardBadge}>
                <PulsingDot color="#10B981" size={8} />
                <Text style={styles.badgeText}>Active</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.ticketIdSection}>
                <Text style={styles.ticketIdLabel}>Ticket ID</Text>
                <View style={styles.ticketIdContainer}>
                  <Text style={styles.ticketIdValue}>{ticketId || "2"}</Text>
                  <TouchableOpacity style={styles.copyButton}>
                    <Icon name="content-copy" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {[
                { label: "Category", value: selectedCategory?.title || "Chemical Accidents", color: "#3B82F6" },
                { label: "Subcategory", value: selectedSubcategory || "Spill", color: "#6B7280" },
                {
                  label: "Location",
                  value: currentTicket.location || "Production Floor - Section A",
                  color: "#6B7280",
                },
                { label: "Equipment", value: "Heavy Machinery Unit #A-123", color: "#6B7280" },
                { label: "Reported By", value: currentTicket.assigneeName || "John Doe", color: "#6B7280" },
                { label: "Department", value: "Production Floor", color: "#6B7280" },
              ].map((item, index) => (
                <View key={index} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{item.label}</Text>
                  <Text style={[styles.detailValue, { color: item.color }]}>{item.value}</Text>
                </View>
              ))}

              <View style={styles.prioritySection}>
                <Text style={styles.detailLabel}>Priority</Text>
                <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor("High")}20` }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor("High") }]}>High</Text>
                </View>
              </View>

              <View style={styles.prioritySection}>
                <Text style={styles.detailLabel}>Severity</Text>
                <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor("High")}20` }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor("High") }]}>High</Text>
                </View>
              </View>
            </View>
          </AnimatedCard>

          {/* Enhanced Assignment & SLA Card */}
          <AnimatedCard delay={1200} style={styles.assignmentCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="account-clock" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.cardTitle}>Assignment & SLA</Text>
            </View>

            <View style={styles.cardContent}>
              {/* Enhanced Assignee Section */}
              <View style={styles.assigneeSection}>
                <Text style={styles.assigneeLabel}>Assigned To</Text>
                <TouchableOpacity style={styles.assigneeInfo} onPress={handleContactAssignee} activeOpacity={0.7}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>EC</Text>
                    <View style={styles.onlineIndicator}>
                      <PulsingDot color="#10B981" size={6} />
                    </View>
                  </View>
                  <View style={styles.assigneeDetails}>
                    <Text style={styles.assigneeName}>Emily Chen</Text>
                    <Text style={styles.assigneeRole}>Safety Officer</Text>
                    <Text style={styles.assigneeDepartment}>Safety & Compliance</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <PulsingDot color="#10B981" size={6} />
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* SLA Section with Visual Enhancement */}
              <View style={styles.slaSection}>
                <View style={styles.slaHeader}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#F59E0B" />
                  <Text style={styles.slaLabel}>SLA Resolution Time</Text>
                </View>
                <Text style={styles.slaTime}>4 hours</Text>
              </View>

              {/* Enhanced Timer Section */}
              <View style={styles.timerSection}>
                <View style={styles.timerRow}>
                  <View style={styles.timerIconContainer}>
                    <MaterialCommunityIcons name="timer-sand" size={16} color="#6B7280" />
                  </View>
                  <Text style={styles.timerLabel}>Time Elapsed</Text>
                  <Text style={styles.timerValue}>{formatTime(timeElapsed)}</Text>
                </View>
                <View style={styles.timerRow}>
                  <View style={styles.timerIconContainer}>
                    <MaterialCommunityIcons name="timer" size={16} color="#6B7280" />
                  </View>
                  <Text style={styles.timerLabel}>Time Remaining</Text>
                  <Text 
                    style={[
                      styles.timeRemainingText, 
                      { color: timeRemaining < 3600 ? "#EF4444" : "#111827" } as const
                    ]}>
                    {formatTime(timeRemaining)}
                  </Text>
                </View>
              </View>

              {/* Enhanced Progress Section */}
              <View style={styles.progressSection}>
                <AnimatedProgressBar
                  progress={getSLAProgress()}
                  height={12}
                  backgroundColor="#E5E7EB"
                  progressColor={getSLAProgress() > 75 ? "#EF4444" : "#10B981"}
                  duration={2000}
                />
                <Text style={styles.progressText}>{getSLAProgress().toFixed(1)}% of SLA time used</Text>
              </View>

              {/* Enhanced Witnesses Section */}
              <View style={styles.witnessSection}>
                <View style={styles.witnessHeader}>
                  <MaterialCommunityIcons name="account-group" size={16} color="#6B7280" />
                  <Text style={styles.witnessLabel}>Witnesses</Text>
                </View>
                <View style={styles.witnessList}>
                  {["John Doe", "Jane Smith"].map((witness, index) => (
                    <View key={index} style={styles.witnessItem}>
                      <View style={styles.witnessAvatar}>
                        <Text style={styles.witnessAvatarText}>
                          {witness
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Text>
                      </View>
                      <Text style={styles.witnessName}>{witness}</Text>
                      <TouchableOpacity style={styles.contactWitnessButton}>
                        <Icon name="message" size={14} color="#3B82F6" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Enhanced Next Steps */}
        <AnimatedCard delay={1400} style={styles.nextStepsCard}>
          <View style={styles.nextStepsHeader}>
            <MaterialCommunityIcons name="format-list-checks" size={24} color="#8B5CF6" />
            <Text style={styles.nextStepsTitle}>Next Steps</Text>
          </View>
          <View style={styles.nextStepsList}>
            {[
              {
                icon: "check-circle",
                text: "Your incident report has been automatically assigned to the safety team",
                completed: true,
              },
              {
                icon: "email",
                text: "You will receive email notifications about the progress of your report",
                completed: false,
              },
              {
                icon: "phone",
                text: "The assigned safety officer will contact you within the SLA timeframe",
                completed: false,
              },
              {
                icon: "assessment",
                text: "Investigation will begin immediately and you'll be updated on findings",
                completed: false,
              },
            ].map((step, index) => (
              <View key={index} style={styles.nextStepItem}>
                <View 
                  style={[
                    styles.step, 
                    { backgroundColor: step.completed ? "#D1FAE5" : "#F3F4F6" } as const
                  ]}>
                  <View style={styles.stepIcon}>
                    {step.completed ? (
                      <Icon name="check-circle" size={24} color="#10B981" />
                    ) : (
                      <Text 
                        style={[
                          styles.stepNumber, 
                          { color: step.completed ? "#374151" : "#6B7280" } as const
                        ]}>
                        {index + 1}
                      </Text>
                    )}
                  </View>
                </View>
                <Text 
                  style={[
                    styles.nextStepText, 
                    { color: step.completed ? "#374151" : "#6B7280" } as const
                  ]}>
                  {step.text}
                </Text>
              </View>
            ))}
          </View>
        </AnimatedCard>

        {/* Enhanced Emergency Contact */}
        <AnimatedCard delay={1600} style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <View style={styles.emergencyIconContainer}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#EF4444" />
            </View>
            <View style={styles.emergencyTextContainer}>
              <Text style={styles.emergencyTitle}>Emergency Contact</Text>
              <Text style={styles.emergencySubtitle}>24/7 Support Available</Text>
            </View>
          </View>
          <Text style={styles.emergencyText}>If this is a critical safety emergency, call immediately:</Text>
          <View style={styles.emergencyButtons}>
            <TouchableOpacity style={styles.emergencyButton} onPress={handleCallEmergency}>
              <MaterialCommunityIcons name="phone" size={20} color="white" />
              <Text style={styles.emergencyButtonText}>Call 911</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emergencySecondaryButton}>
              <MaterialCommunityIcons name="message-text" size={20} color="#EF4444" />
              <Text style={styles.emergencySecondaryText}>Text Support</Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        {/* Additional Features */}
        <AnimatedCard delay={1800} style={styles.additionalFeaturesCard}>
          <Text style={styles.additionalFeaturesTitle}>Additional Actions</Text>
          <View style={styles.featureGrid}>
            <TouchableOpacity style={styles.featureItem}>
              <MaterialCommunityIcons name="camera" size={24} color="#3B82F6" />
              <Text style={styles.featureText}>Add Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureItem}>
              <MaterialCommunityIcons name="microphone" size={24} color="#8B5CF6" />
              <Text style={styles.featureText}>Voice Note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureItem}>
              <MaterialCommunityIcons name="map-marker" size={24} color="#10B981" />
              <Text style={styles.featureText}>Update Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureItem}>
              <MaterialCommunityIcons name="account-plus" size={24} color="#F59E0B" />
              <Text style={styles.featureText}>Add Witness</Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 16,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  signalContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  bar: {
    width: 3,
    backgroundColor: "#10B981",
    borderRadius: 1,
  },
  bar1: { height: 4 },
  bar2: { height: 6 },
  bar3: { height: 8 },
  bar4: { height: 10 },
  networkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 8,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  successBanner: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
    borderWidth: 2,
    margin: 20,
    marginBottom: 16,
  },
  successContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  successIconContainer: {
    position: "relative",
    marginRight: 16,
  },
  successRipple: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    justifyContent: "center",
    alignItems: "center",
  },
  ripple: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10B981",
  },
  successTextContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#047857",
    lineHeight: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  mainContent: {
    flexDirection: width > 768 ? "row" : "column",
    paddingHorizontal: 20,
    gap: 16,
  },
  detailsCard: {
    flex: 1,
    marginBottom: width > 768 ? 0 : 16,
  },
  assignmentCard: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  cardBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    color: "#065F46",
    fontWeight: "600",
  },
  cardContent: {
    gap: 16,
  },
  ticketIdSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
  },
  ticketIdLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  ticketIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketIdValue: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "700",
  },
  copyButton: {
    padding: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  prioritySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  priorityBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "700",
  },
  assigneeSection: {
    marginBottom: 20,
  },
  assigneeLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 12,
  },
  assigneeInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
  },
  avatarContainer: {
    position: "relative",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  assigneeDetails: {
    flex: 1,
  },
  assigneeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  assigneeRole: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  assigneeDepartment: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#065F46",
    fontWeight: "600",
  },
  slaSection: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  slaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  slaLabel: {
    fontSize: 14,
    color: "#92400E",
    fontWeight: "600",
    marginLeft: 8,
  },
  slaTime: {
    fontSize: 20,
    fontWeight: "700",
    color: "#92400E",
  },
  timerSection: {
    gap: 12,
    marginBottom: 16,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
  },
  timerIconContainer: {
    width: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  timerLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
  },
  timerValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  progressSection: {
    gap: 8,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },
  timeRemainingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
  },

  witnessSection: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  witnessHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  witnessLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginLeft: 8,
  },
  witnessList: {
    gap: 8,
  },
  witnessItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
  },
  witnessAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  witnessAvatarText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },
  witnessName: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    flex: 1,
  },
  contactWitnessButton: {
    padding: 4,
  },
  nextStepsCard: {
    margin: 20,
    marginTop: 0,
  },
  nextStepsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 12,
  },
  nextStepsList: {
    gap: 16,
  },
  nextStepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  nextStepText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontWeight: "500",
  },
  emergencyCard: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 2,
    margin: 20,
    marginTop: 0,
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emergencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emergencyTextContainer: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
  },
  emergencySubtitle: {
    fontSize: 12,
    color: "#7F1D1D",
    fontWeight: "500",
  },
  emergencyText: {
    fontSize: 14,
    color: "#7F1D1D",
    marginBottom: 16,
    fontWeight: "500",
  },
  emergencyButtons: {
    flexDirection: "row",
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EF4444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
    marginLeft: 8,
  },
  emergencySecondaryButton: {
    flex: 1,
    backgroundColor: "white",
    borderColor: "#EF4444",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencySecondaryText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "700",
    marginLeft: 8,
  },
  additionalFeaturesCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 40,
  },
  additionalFeaturesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  featureText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
})

export default EnhancedTicketSuccessScreen
