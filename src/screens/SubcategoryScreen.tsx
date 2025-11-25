import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectSubcategory, IncidentCategory } from '../store/slices/incidentSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions, PermissionsAndroid, Platform } from 'react-native';
import { createTicket } from '../services/ticketService';
import { createTicket as createTicketAction } from '../store/slices/ticketSlice';

type SubcategoryScreenProps = NativeStackScreenProps<RootStackParamList, 'Subcategory'> & {
  route: {
    params: {
      categoryId: string;
      category?: IncidentCategory;
    };
  };
};

const width = Dimensions.get('window').width;

const holidayImages = [
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Diwali',
  },
  {
    url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    title: 'Christmas',
  },
  {
    url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    title: 'Holi',
  },
  {
    url: 'https://images.unsplash.com/photo-1556767576-3c9a9c6c4f8b?auto=format&fit=crop&w=800&q=80',
    title: 'Eid',
  },
  {
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    title: 'Thanksgiving',
  },
  {
    url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80',
    title: 'New Year',
  },
];

const subcategoryEmojis: { [key: string]: string } = {
  // Machinery Accidents
  'Entanglement': '🪢',
  'Crushing': '🪨',
  'Shearing': '✂️',
  'Impact': '💥',
  'Caught-In/Between': '🪤',
  'Pinch Point': '🤏',
  'Electric Shock': '⚡',
  'Arc Flash/Blast': '⚡',
  'Burns (Thermal Contact)': '🔥',
  'Overturn/Tip-Over': '🚜',
  'Mechanical Failure': '⚙️',
  'Flying Debris': '💨',
  'High Noise Exposure': '🔊',
  'Vibration-Related Injuries': '🎛️',
  'Repetitive Strain Injuries': '🔁',
  'Chemical Exposure': '🧪',

  // Chemical Accidents
  'Chemical Burns': '🔥',
  'Inhalation of Fumes': '💨',
  'Chemical Spills': '🧪',
  'Explosions': '💥',
  'Fire from Flammable Chemicals': '🔥',
  'Chemical Splash Injuries': '💧',
  'Asphyxiation': '😮‍💨',
  'Chemical Leak': '⚗️',
  'Corrosive Exposure': '☣️',
  'Poisoning': '☠️',
  'Allergic Reactions': '🤧',
  'Long-Term Toxic Exposure': '🧬',
  'Improper Chemical Mixing': '🧫',
  'Environmental Contamination': '🌱',
  'Chemical Waste Disposal Incidents': '🚮',

  // Fire & Explosion
  'Gas Leak Explosions': '🧯',
  'Flammable Liquid Fires': '🔥',
  'Dust Explosions': '💨',
  'Electrical Fires': '⚡',
  'Boiler Explosions': '♨️',
  'Hot Work Fires': '🔥',
  'Spontaneous Combustion': '💥',
  'Battery Fires': '🔋',
  'Chemical Reaction Explosions': '⚗️',
  'Fires from Static Electricity': '⚡',
  'Cooking Oil Fires': '🍳',
  'Compressed Gas Cylinder Explosions': '🧯',
  'Arson or Intentional Fires': '🕵️',
  'Vehicle or Equipment Fires': '🚗',
  'Overheating Fires': '🌡️',
  'Waste or Trash Fires': '🗑️',
  'Environmental Fire Hazards': '🌲',

  // Material Handling
  'Dropped Loads': '📦',
  'Manual Lifting Injuries': '💪',
  'Overexertion': '😓',
  'Caught-In/Between Incidents': '🪤',
  'Slip and Trip Hazards': '🤕',
  'Forklift and Vehicle Incidents': '🚜',
  'Pallet Jack Accidents': '🛒',
  'Overstacking Hazards': '🗄️',
  'Improper Storage Incidents': '📚',
  'Crane or Hoist Failures': '🏗️',
  'Ergonomic Strain Injuries': '🧍‍♂️',
  'Chemical Exposure from Spills': '🧪',
  'Mechanical Handling Injuries': '⚙️',
  'Loading Dock Accidents': '🚚',
  'Repetitive Motion Injuries': '🔁',
  'Vehicle Overloading Incidents': '🚛',

  // Waste Management
  'Exceeding Permitted Discharge Limits': '💧',
  'Unauthorized Discharge': '🚱',
  'High pH or Low pH Discharge': '🧪',
  'Oil or Grease Discharge': '🛢️',
  'Excessive Suspended Solids': '🧂',
  'High Biochemical Oxygen Demand (BOD)': '🧬',
  'Chemical Spills in Wastewater': '💦',
  'Temperature Exceedance': '🌡️',
  'Metal Contaminant Discharge': '🔩',
  // 'Chemical Spills': '🧪',
  'Leaking Waste Containers': '🗑️',
  'Improper Waste Disposal': '🚮',
  'Waste Storage Overflows': '🗑️',
  'Inadequate PPE Usage': '🦺',
  'Exposure to Toxic Gases': '☠️',
  'Fire Hazards': '🔥',
  'Injury During Waste Handling': '🤕',
  'Non-Compliance with Regulations': '⚠️',

  // Aircraft Ground Handling
  'Equipment Collisions': '💥',
  'Aircraft Damage': '✈️',
  'FOD (Foreign Object Debris)': '🪙',
  'Fuel Spill/Leak': '⛽',
  'Ramp Vehicle Accidents': '🚚',
  'Jet Blast': '💨',
  'Passenger/Staff Injury': '🧑‍✈️',
  'Incorrect Loading/Offloading': '📦',
  'Aircraft Tug Towbar Failure': '🛠️',
  'De-Icing Fluid Spill': '❄️',
  'Communication Errors': '📡',
  'Ground Power Unit (GPU) Issues': '🔌',
  'Catering/Service Vehicle Errors': '🍽️',
  'Weather-Related Incidents': '🌦️',

  // Assembly Line Incidents
  // 'Repetitive Strain Injuries': '🔁',
  'Human Error': '🙍',
  'Safety Protocol Violation': '🚫',
  'Power Outage': '💡',
  'Chemical Spill': '🧪',
  'Conveyor Belt Issue': '🔄',
  'Machine Malfunction': '⚙️',
  'Slip and Fall': '🤕',
  'Material Jam': '🧱',
  'Fire': '🔥',

  // Chemical Exposure
  'Battery Acid Burns': '🔋',

  // Ergonomics
  'Poor Posture Injuries': '🧍',

  // Tool & Equipment
  'Cutting Injuries': '🔪',

  // Food Preparation
  'Burns': '🔥',

  // Housekeeping
  'Slips and falls': '🤕',

  // Guest Safety
  'Violent Incidents': '🛡️',

  // Electrical Incidents
  'Electrocution': '⚡',
  // 'Electric Shock': '⚡',
  // 'Arc Flash/Blast': '⚡',

  // Environmental Hazard
  'Air quality issues': '🌫️',

  // Entanglement Incidents
  'Clothing/Body Part Entanglement': '👕',
  'Loose Object Entanglement': '🪢',

  // Crushing Accidents
  'Pinch Points': '🤏',
  'Machine Overturn': '🚜',

  // Cutting and Shearing
  'Sharp Tool/Blade Contact': '🔪',
  // 'Flying Debris': '💨',

  // Caught-In/Between
  'Conveyor Belt Incidents': '🔄',
  'Press Machines': '🖨️',

  // Mechanical Failure
  'Hydraulic Pressure Failure': '💧',
  'Loss of Guarding': '🛡️',

  // Vibration-Related Injuries
  'Hand-Arm Vibration Syndrome (HAVS)': '✋',

  // Noise Exposure
  'High Noise from Machinery': '🔊',

  // Ergonomic Strains
  'Repetitive Motion': '🔁',

  // Heat-Related Incidents
  'Burns from Overheating Equipment': '🌡️',

  // Dust and Particle Exposure
  'Respiratory Hazards': '😮‍💨',
};

const Subcategory: React.FC<SubcategoryScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { selectedCategory } = useAppSelector(
    (state) => state.incident
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, _setSelectedOption] = useState<string>('');
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const holidayScrollRef = useRef<ScrollView>(null);

  // Animation function
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Get category from route params if available
  const category = route.params?.category || selectedCategory;

  const handleSubcategorySelect = async (subcategory: string) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const incidentName = category?.title || 'Incident';

      dispatch(selectSubcategory(subcategory));

      animatePress();

      try {
        const navTimeout = setTimeout(() => {
          navigation.navigate('SimpleTicketSuccess', {
            incidentName,
            subcategory,
            ticketId: `TEMP-${Date.now()}`,
          });
        }, 2000);
        // Best-effort location capture
        const getLocation = async (): Promise<{ lat: number; lng: number } | null> => {
          try {
            if (Platform.OS === 'android') {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
              );
              if (granted !== PermissionsAndroid.RESULTS.GRANTED) return null;
            }
            const geo: any = (global as any)?.navigator?.geolocation;
            if (!geo?.getCurrentPosition) return null;
            return await new Promise((resolve) => {
              const timeout = setTimeout(() => resolve(null), 5000);
              geo.getCurrentPosition(
                (pos: any) => {
                  clearTimeout(timeout);
                  resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                () => {
                  clearTimeout(timeout);
                  resolve(null);
                },
                { enableHighAccuracy: true, timeout: 4000, maximumAge: 2000 }
              );
            });
          } catch {
            return null;
          }
        };
        const location = await getLocation();

        const result = await createTicket({
          incidentName,
          subcategory,
          categoryId: (category && (category as any).id) || route.params.categoryId,
          priority: 'medium',
          hasResolverGroup: true,
          location
        });

        console.log('Ticket created successfully:', result);

        // Also update Redux state
        dispatch(createTicketAction({
          id: result.ticketId,
          category: incidentName,
          subcategory,
          priority: 'High',
          location: location ? {
            building: 'Detected Location',
            floor: 'N/A',
            room: 'N/A',
            coordinates: location
          } : undefined
        }));


        navigation.navigate('SimpleTicketSuccess', {
          incidentName,
          subcategory,
          ticketId: result.ticketId,
          location,
        });
        clearTimeout(navTimeout);
      } catch (error) {
        console.error('Error creating ticket:', error);
        navigation.navigate('SimpleTicketSuccess', {
          incidentName,
          subcategory,
          ticketId: `TEMP-${Date.now()}`,
        });
      }
    } catch (error) {
      console.error('Error in handleSubcategorySelect:', error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  // Removed unused handleSubmit function as we're using handleSubcategorySelect directly

  // Get dynamic colors based on selected category
  const getCategoryColors = () => {
    const categoryColor = (selectedCategory && (selectedCategory as any).color) || '#a7dcffff';
    return {
      headerColor: categoryColor,
      selectedCardColor: categoryColor,
      selectedBorderColor: categoryColor,
      selectedTextColor: categoryColor,
    };
  };

  const colors = getCategoryColors();

  const subcategoryOptions = selectedCategory?.subcategories || [
    'Caught in machinery',
    'Equipment malfunction',
    'Improper operation',
    'Missing safety guards',
    'Maintenance accident',
    'Tool-related injury',
  ];

  React.useEffect(() => {
    let scrollValue = 0;
    const interval = setInterval(() => {
      if (holidayScrollRef.current) {
        scrollValue += width;
        if (scrollValue >= width * holidayImages.length) {
          scrollValue = 0; // Reset to the first card
        }
        holidayScrollRef.current.scrollTo({ x: scrollValue, animated: true });
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Colored Top Bar with Back Navigation and Title */}
      <View style={[styles.topBar]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" color="#1c5b85ff" size={24} />
          <Text style={styles.backButtonText}>Report incident</Text>
        </TouchableOpacity>
      </View>

      {/* Category Info (white background) */}
      <View style={[styles.categoryHeaderSection, { backgroundColor: colors.headerColor }]}>
        <View style={styles.categoryIconContainer}>
          <Text style={styles.categoryIconDark}>{selectedCategory?.icon || '⚙️'}</Text>
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryTitleDark}>
            {selectedCategory?.title || 'Machinery Accident'}
          </Text>
          <Text style={styles.categorySubtitleDark}>Equipment and machinery incidents</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.instructionText}>Select the specific type of incident:</Text>

        <Animated.View
          style={[
            styles.optionsContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          {subcategoryOptions.map((option, index) => {
            const emoji = subcategoryEmojis[option];
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  selectedOption === option && {
                    ...styles.selectedOptionCard,
                    borderColor: colors.selectedBorderColor,
                  },
                ]}
                onPress={() => {
                  animatePress();
                  handleSubcategorySelect(option);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.emojiStyle}>
                    {emoji || '❓'}
                  </Text>
                  <Text
                    style={[
                      styles.optionText,
                      selectedOption === option && {
                        ...styles.selectedOptionText,
                        color: colors.selectedTextColor,
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>


      </ScrollView>

      {/* Submit Button */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  optionButtonSelected: {
    backgroundColor: '#9bd7ffff', // fallback or use your dynamic color
  },
  optionButtonUnselected: {
    backgroundColor: '#D1D5DB',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#1c5b85ff',
    //padding: 10,
    //backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  backButtonText: {
    fontSize: 22,
    color: '#1c5b85ff',
    marginLeft: 8,
    fontWeight: '600',
    marginTop: 0,
    textAlign: 'left',
    marginBottom: 0,
  },
  categoryHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgb(221, 175, 175)',
  },
  categoryIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 12,
  },
  categoryIcon: {
    fontSize: 40,
    color: '#ffffff',
  },
  categoryIconDark: {
    fontSize: 40,
    color: '#1c5b85ff',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ' #ffffff',
    marginBottom: 1,
  },
  categoryTitleDark: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c5b85ff',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  categorySubtitleDark: {
    fontSize: 18,
    color: '#1c5b85ff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
    justifyContent: 'center',
  },
  selectedOptionCard: {
    borderWidth: 2,
    shadowOpacity: 0.15,
    elevation: 6,
  },
  optionContent: {
    position: 'relative',
    alignItems: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    //top: 3,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 20,
    color: '#0f0f0fff',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c5b85ff',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  submitIcon: {
    marginLeft: 8,
  },
  holidayScroll: {
    marginTop: 12,
  },
  holidayCard: {
    width: width * 0.8, // Adjust card width
    height: 200, // Adjust card height
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  holidayImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  optionIcon: {
    // Additional styles for the icon if needed
  },
  emojiStyle: { fontSize: 36, marginBottom: 8 },
});

export default Subcategory;