'use client';

import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import type { RootStackParamList } from '../navigation/types';
import { updateTicketTimer } from '../store/slices/ticketSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type EnhancedTicketSuccessScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EnhancedTicketSuccess'
>;
const EnhancedTicketSuccess: React.FC<
  EnhancedTicketSuccessScreenProps
> = ({ navigation, route }) => {
  const { ticketId } = route.params as { ticketId: string };
  const dispatch = useAppDispatch();
  const { currentTicket } = useAppSelector(state => state.ticket);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const successIconScale = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [timeRemaining, setTimeRemaining] = useState(14400); // 4 hours in seconds
  const [slaProgress, setSlaProgress] = useState(0.1);

  useEffect(() => {
    // Entry animations sequence
    Animated.sequence([
      // Fade in and slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Success icon bounce
      Animated.spring(successIconScale, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      // Staggered card animations
      Animated.stagger(200, [
        Animated.spring(cardAnimations[0], {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnimations[1], {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnimations[2], {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: slaProgress,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Pulse animation for SLA timer
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    // Timer updates
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
      setSlaProgress(prev => Math.min(1, prev + 0.001));
      dispatch(updateTicketTimer());
    }, 1000);

    return () => {
      clearInterval(timer);
      pulseAnimation.stop();
    };
  }, [
    dispatch,
    fadeAnim,
    slideAnim,
    scaleAnim,
    successIconScale,
    cardAnimations,
    progressAnim,
    pulseAnim,
    slaProgress,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 1000000); // 10 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const getProgressColor = () => {
    if (slaProgress < 0.5) return '#10B981';
    if (slaProgress < 0.75) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" /> */}
{/* Colored Top Bar with Back Navigation and Title */}
      <View style={[styles.topBar]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" color="#1c5b85ff" size={24} />
          <Text style={styles.backButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
      
      {/* Header */}
      {/* <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToDashboard}
        >
          <MaterialIcons name="arrow-back" size={24} color="#64748B" />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Ticket Details</Text>
        </View>
      </Animated.View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Success Banner */}
          <Animated.View
            style={[
              styles.successBanner,
              {
                transform: [{ scale: successIconScale }],
              },
            ]}
          >
            <View style={[styles.successGradient, styles.successGradientBg]}>
              <View style={styles.successIconContainer}>
                <MaterialIcons name="check-circle" size={32} color="#059669" />
              </View>
              <View style={styles.successTextContainer}>
                <Text style={styles.successTitle}>
                  Issue Reported Successfully!
                </Text>
                <Text style={styles.successSubtitle}>
                  Your safety concern has been logged and assigned to our team.
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Main Cards Row */}
          <View style={styles.cardsContainer}>
            <Animated.View style={styles.infoCard}>
              <View style={[styles.cardGradient, { backgroundColor: '#23a191ff' }]}>
                <View style={styles.cardHeader}>
                  <MaterialIcons
                    name="confirmation-number"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.cardTitle}>Ticket ID</Text>
                </View>
                <Text style={styles.ticketId}>{ticketId || 'HSI-283667'}</Text>
                <Text style={styles.cardSubtitle}>Reference Number</Text>
              </View>
            </Animated.View>
            <Animated.View style={styles.infoCard}>
              <View style={[styles.cardGradient, { backgroundColor: '#8b5cf6ff' }]}>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="person" size={20} color="#FFFFFF" />
                  <Text style={styles.cardTitle}>Assigned To</Text>
                </View>
                <Text style={styles.assigneeName}>
                  {currentTicket?.assignedTo?.name || 'Sarah Johnson'}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {currentTicket?.assignedTo?.role || 'Safety Supervisor'}
                </Text>
                <View style={styles.statusIndicator}>
                  <View style={styles.activeDot} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            </Animated.View>
            <Animated.View style={styles.infoCard}>
              <View style={[styles.cardGradient, { backgroundColor: 'rgba(255, 109, 109, 1)' }]}>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="schedule" size={20} color="#f8f6fdff" />
                  <Text style={styles.cardTitle}>SLA Timer</Text>
                </View>
                <Text style={styles.slaTime}>{formatTime(timeRemaining)}</Text>
                <Text style={styles.cardSubtitle}>Time Remaining</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${slaProgress * 100}%`,
                          backgroundColor: getProgressColor(),
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Status Timeline */}
          <Animated.View
            style={[
              styles.timelineCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.timelineHeader}>
              <MaterialIcons name="timeline" size={24} color="#374151" />
              <Text style={styles.timelineTitle}>Status Timeline</Text>
            </View>

            <View style={styles.timelineContent}>
              {/* Completed Step */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.completedDot]}>
                  <MaterialIcons name="check" size={12} color="#FFFFFF" />
                </View>
                <View style={styles.timelineItemContent}>
                  <View style={styles.timelineItemHeader}>
                    <Text style={styles.timelineItemTitle}>Issue Reported</Text>
                    <Text style={styles.timelineItemTime}>Just now</Text>
                  </View>
                  <Text style={styles.timelineItemDescription}>
                    Ticket created and assigned
                  </Text>
                </View>
              </View>

              {/* Current Step */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.currentDot]}>
                  <View style={styles.pulseDot} />
                </View>
                <View style={styles.timelineItemContent}>
                  <View style={styles.timelineItemHeader}>
                    <Text style={styles.timelineItemTitle}>
                      Under Investigation
                    </Text>
                    <Text style={styles.timelineItemTime}>Pending</Text>
                  </View>
                  <Text style={styles.timelineItemDescription}>
                    Safety team will assess the issue
                  </Text>
                </View>
              </View>

              {/* Future Step */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.pendingDot]} />
                <View style={styles.timelineItemContent}>
                  <View style={styles.timelineItemHeader}>
                    <Text
                      style={[styles.timelineItemTitle, styles.pendingText]}
                    >
                      Resolution in Progress
                    </Text>
                    <Text style={[styles.timelineItemTime, styles.pendingText]}>
                      Pending
                    </Text>
                  </View>
                  <Text
                    style={[styles.timelineItemDescription, styles.pendingText]}
                  >
                    Action plan will be implemented
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Location Details Card */}
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <MaterialIcons name="location-on" size={20} color="#64748B" />
              <Text style={styles.locationTitle}>Location Details</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Building</Text>
              <Text style={styles.locationValue}>Main Production Facility</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Floor</Text>
              <Text style={styles.locationValue}>Ground Floor</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Room/Area</Text>
              <Text style={styles.locationValue}>Production Area A</Text>
            </View>
            <View style={styles.coordinatesBox}>
              <Text style={styles.coordinatesLabel}>Coordinates</Text>
              <Text style={styles.coordinatesValue}>40.712800, -74.006000</Text>
              <TouchableOpacity>
                <Text style={styles.mapLink}>📍 View on Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 8,
    fontWeight: '500',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
   topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    flex: 1,
  },
  animatedContainer: {
    padding: 20,
    gap: 20,
  },
  successBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  successGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  successTextContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 16, // more space between cards
    marginBottom: 8,
  },
  infoCard: {
    flex: 1,
    minWidth: 0, // ensures flex works correctly
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 0,
  },
  cardGradient: {
    flex: 1,
    padding: 24,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  cardGradientGreen: {
    backgroundColor: '#23a191ff',
  },
  cardGradientPurple: {
    backgroundColor: '#8b5cf6ff',
  },
  cardGradientRed: {
    backgroundColor: 'rgba(255, 109, 109, 1)',
  },
  successGradientBg: {
    backgroundColor: '#e0ffe6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: '600',
    opacity: 0.9,
  },
  ticketId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  assigneeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  slaTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 19,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  timelineContent: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  completedDot: {
    backgroundColor: '#10B981',
  },
  currentDot: {
    backgroundColor: '#F59E0B',
    position: 'relative',
  },
  pendingDot: {
    backgroundColor: '#E2E8F0',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  timelineItemContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  timelineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  timelineItemTime: {
    fontSize: 12,
    color: '#64748B',
  },
  timelineItemDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  pendingText: {
    opacity: 0.6,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 4,
  },
  nextStepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  nextStepsList: {
    gap: 12,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nextStepText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  locationLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  locationValue: {
    color: '#1E293B',
    fontWeight: '600',
    fontSize: 13,
  },
  coordinatesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  coordinatesLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  coordinatesValue: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 4,
  },
  mapLink: {
    color: '#3B82F6',
    fontSize: 13,
    marginTop: 2,
    textDecorationLine: 'underline',
  },

  timelineCardCustom: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineHeaderCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timelineTitleCustom: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  timelineItemCustom: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  timelineDotCustom: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginTop: 6,
    marginRight: 12,
  },
  timelineContentCustom: {
    flex: 1,
  },
  timelineItemTitleCustom: {
    fontWeight: 'bold',
    color: '#1E293B',
    fontSize: 14,
  },
  timelineItemMeta: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 2,
  },
  timelineItemDesc: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 2,
  },
});

export default EnhancedTicketSuccess;
