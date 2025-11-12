import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { RootStackParamList } from '../types/navigation';
import { updateTicketTimer } from '../store/slices/ticketSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

type TicketSuccessScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TicketSuccess'
>;

type TicketSuccessScreenRouteProp = RouteProp<RootStackParamList, 'TicketSuccess'>;

interface Props {
  navigation: TicketSuccessScreenNavigationProp;
  route: TicketSuccessScreenRouteProp;
}

const { width } = Dimensions.get('window');

const TicketSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { ticketId } = route.params;
  const dispatch = useAppDispatch();
  const { currentTicket } = useAppSelector((state) => state.ticket);
  const { selectedCategory, selectedSubcategory } = useAppSelector(
    (state) => state.incident
  );

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(14400); // 4 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
      setTimeRemaining(prev => Math.max(0, prev - 1));
      dispatch(updateTicketTimer());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSLAProgress = () => {
    const totalSLA = 14400; // 4 hours
    return ((totalSLA - timeRemaining) / totalSLA) * 100;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return '#DC2626';
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#EF4444';
    }
  };

  const handleBackToCategories = () => {
    navigation.navigate('Subcategory', {
      categoryId: selectedCategory?.id ?? '',
    });
  };

 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackToCategories}
      >
        <Icon name="arrow-back" size={20} color="#6B7280" />
        <Text style={styles.backButtonText}>Back to Categories</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successIconContainer}>
            <Icon name="check-circle" size={24} color="#10B981" />
          </View>
          <View style={styles.successTextContainer}>
            <Text style={styles.successTitle}>Incident Report Created</Text>
            <Text style={styles.successSubtitle}>
              Your safety incident has been logged and assigned for review
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {/* <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleViewDetails}>
            <Icon name="visibility" size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownloadReport}>
            <Icon name="download" size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View> */}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Incident Details */}
          <View style={styles.detailsCard}>
            <View style={styles.cardHeader}>
              <Icon name="description" size={20} color="#6B7280" />
              <Text style={styles.cardTitle}>Incident Details</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ticket ID</Text>
                <Text style={styles.detailValue}>{ticketId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={[styles.detailValue, styles.categoryValue]}>
                  {selectedCategory?.title || 'Machinery Accident'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Subcategory</Text>
                <Text style={styles.detailValue}>
                  {selectedSubcategory || 'Caught in machinery'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>
                  {currentTicket.location || 'Production Floor - Section A'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Equipment</Text>
                <Text style={styles.detailValue}>
                  {currentTicket.additionalDetails?.equipmentInvolved || 'Heavy Machinery Unit #A-123'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reported By</Text>
                <Text style={styles.detailValue}>
                  {currentTicket.assigneeName || 'John Doe'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Department</Text>
                <Text style={styles.detailValue}>
                  {currentTicket.additionalDetails?.department || 'Production Floor'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Priority</Text>
                <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor('High')}20` }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor('High') }]}>
                    High
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Severity</Text>
                <Text style={styles.detailValue}>
                  {currentTicket.additionalDetails?.severity || 'High'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Immediate Actions</Text>
                <Text style={styles.detailValue}>
                  {currentTicket.additionalDetails?.immediateActions || 'Area secured, equipment shut down'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Created</Text>
                <Text style={styles.detailValue}>
                  {new Date().toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                  })}, {new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Assignment & SLA */}
          <View style={styles.assignmentCard}>
            <View style={styles.cardHeader}>
              <Icon name="person" size={20} color="#6B7280" />
              <Text style={styles.cardTitle}>Assignment & SLA</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.assigneeSection}>
                <Text style={styles.assigneeLabel}>Assigned To</Text>
                <View style={styles.assigneeInfo}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                      {currentTicket.assignedTo?.avatar || 'EC'}
                    </Text>
                  </View>
                  <View style={styles.assigneeDetails}>
                    <Text style={styles.assigneeName}>
                      {currentTicket.assignedTo?.name || 'Emily Chen'}
                    </Text>
                    <Text style={styles.assigneeRole}>
                      {currentTicket.assignedTo?.role || 'Safety Officer'}
                    </Text>
                    <Text style={styles.assigneeDepartment}>
                      {currentTicket.assignedTo?.department || 'Safety & Compliance'}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
              </View>

              <View style={styles.slaSection}>
                <Text style={styles.slaLabel}>SLA Resolution Time</Text>
                <Text style={styles.slaTime}>4 hours</Text>
              </View>

              <View style={styles.timerSection}>
                <View style={styles.timerRow}>
                  <Icon name="access-time" size={16} color="#6B7280" />
                  <Text style={styles.timerLabel}>Time Elapsed</Text>
                  <Text style={styles.timerValue}>{formatTime(timeElapsed)}</Text>
                </View>
                <View style={styles.timerRow}>
                  <Icon name="schedule" size={16} color="#6B7280" />
                  <Text style={styles.timerLabel}>Time Remaining</Text>
                  <Text style={[styles.timerValue, { color: timeRemaining < 3600 ? '#EF4444' : '#111827' }]}>
                    {formatTime(timeRemaining)}
                  </Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${getSLAProgress()}%`,
                        backgroundColor: getSLAProgress() > 75 ? '#EF4444' : '#10B981'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {getSLAProgress().toFixed(1)}% of SLA time used
                </Text>
              </View>

              {/* Witnesses Section */}
              <View style={styles.witnessSection}>
                <Text style={styles.witnessLabel}>Witnesses</Text>
                <View style={styles.witnessList}>
                  {(currentTicket.additionalDetails?.witnesses || ['John Doe', 'Jane Smith']).map((witness, index) => (
                    <View key={index} style={styles.witnessItem}>
                      <Icon name="person" size={16} color="#6B7280" />
                      <Text style={styles.witnessName}>{witness}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>Next Steps</Text>
          <View style={styles.nextStepsList}>
            <View style={styles.nextStepItem}>
              <Icon name="check-circle" size={16} color="#10B981" />
              <Text style={styles.nextStepText}>
                Your incident report has been automatically assigned to the safety team
              </Text>
            </View>
            <View style={styles.nextStepItem}>
              <Icon name="email" size={16} color="#3B82F6" />
              <Text style={styles.nextStepText}>
                You will receive email notifications about the progress of your report
              </Text>
            </View>
            <View style={styles.nextStepItem}>
              <Icon name="phone" size={16} color="#F59E0B" />
              <Text style={styles.nextStepText}>
                The assigned safety officer will contact you within the SLA timeframe
              </Text>
            </View>
            <View style={styles.nextStepItem}>
              <Icon name="assessment" size={16} color="#8B5CF6" />
              <Text style={styles.nextStepText}>
                Investigation will begin immediately and you'll be updated on findings
              </Text>
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Icon name="emergency" size={24} color="#EF4444" />
            <Text style={styles.emergencyTitle}>Emergency Contact</Text>
          </View>
          <Text style={styles.emergencyText}>
            If this is a critical safety emergency, call immediately:
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Icon name="phone" size={20} color="white" />
            <Text style={styles.emergencyButtonText}>Call Emergency: 911</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  successBanner: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  successTextContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#047857',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 8,
  },
  mainContent: {
    flexDirection: width > 768 ? 'row' : 'column',
    paddingHorizontal: 20,
    gap: 16,
  },
  detailsCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: width > 768 ? 0 : 16,
  },
  assignmentCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  cardContent: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  categoryValue: {
    color: '#3B82F6',
  },
  priorityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  assigneeSection: {
    marginBottom: 16,
  },
  assigneeLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  assigneeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  assigneeDetails: {
    flex: 1,
  },
  assigneeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  assigneeRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  assigneeDepartment: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  slaSection: {
    marginBottom: 16,
  },
  slaLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  slaTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timerSection: {
    gap: 8,
    marginBottom: 16,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  timerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  progressSection: {
    gap: 8,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  witnessSection: {
    marginTop: 16,
  },
  witnessLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  witnessList: {
    gap: 8,
  },
  witnessItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  witnessName: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
  },
  nextStepsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
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
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#7F1D1D',
    marginBottom: 12,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TicketSuccessScreen;
