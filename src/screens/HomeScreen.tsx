import React, { useRef, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert} from 'react-native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { selectCategory, selectSubcategory, resetSelection, IncidentCategory } from '../store/slices/incidentSlice';


interface Props {}

const { width } = Dimensions.get('window');
const holidayFeed = [
  {
    id: '1',
    title: 'Independence Day',
    date: '2024-08-15',
    description: 'Celebration of India\'s independence from British rule.',
  },
  {
    id: '2',
    title: 'Diwali',
    date: '2024-11-01',
    description: 'Festival of Lights celebrated across India.',
  },
  {
    id: '3',
    title: 'Christmas',
    date: '2024-12-25',
    description: 'Celebration of the birth of Jesus Christ.',
  },
];

// Helper: decide whether to use MaterialIcons (simple ascii icon names) or render as emoji text
const looksLikeIconName = (s: string) => /^[a-z][a-z0-9_-]*$/i.test(s || '');

const Home: React.FC<Props> = () => {
  const glowAnim = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.25,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeCategory] = useState<IncidentCategory | null>(null);
  const [topBarH, setTopBarH] = useState(0);
  const [headerH, setHeaderH] = useState(0);
  const [moreBtnH, setMoreBtnH] = useState(56);
  const [tileH, setTileH] = useState<number | null>(null);
  // Removed unused showAllCategories state

  // Festival carousel ref
  //const festivalScrollRef = React.useRef<ScrollView>(null);
  const holidayScrollRef = React.useRef<ScrollView>(null);

  // Move this OUTSIDE of any function!
  const categories = useAppSelector(state => state.incident.categories);
  //const tickets = useAppSelector(state => state.ticket.tickets);

  const upcomingHolidays = [
    {
      id: '1',
      name: 'Independence Day',
      date: 'August 15, 2025',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', // Fireworks in India
      icon: '🎆',
      bgColor: '#ffe082',
      url: 'https://en.wikipedia.org/wiki/Independence_Day_(India)',
    },
    {
      id: '2',
      name: 'Raksha Bandhan',
      date: 'August 19, 2025',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80', // Rakhi tying
      icon: '🪢',
      bgColor: '#b2dfdb',
      url: 'https://en.wikipedia.org/wiki/Raksha_Bandhan',
    },
    {
      id: '3',
      name: 'Janmashtami',
      date: 'August 26, 2025',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80', // Dahi handi festival
      icon: '🦚',
      bgColor: '#ffe0b2',
      url: 'https://en.wikipedia.org/wiki/Krishna_Janmashtami',
    },
    {
      id: '4',
      name: 'Ganesh Chaturthi',
      date: 'September 6, 2025',
      image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80', // Ganesh idol immersion
      icon: '🐘',
      bgColor: '#c5cae9',
      url: 'https://en.wikipedia.org/wiki/Ganesh_Chaturthi',
    },
    {
      id: '5',
      name: 'Onam',
      date: 'September 15, 2025',
      image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=800&q=80', // Onam pookalam
      icon: '🌸',
      bgColor: '#ffe4e1',
      url: 'https://en.wikipedia.org/wiki/Onam',
    },
    {
      id: '6',
      name: 'Navratri',
      date: 'September 29, 2025',
      image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80', // Garba dance
      icon: '🪔',
      bgColor: '#e1bee7',
      url: 'https://en.wikipedia.org/wiki/Navratri',
    },
    {
      id: '7',
      name: 'Diwali',
      date: 'October 20, 2025',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', // Diwali lamps
      icon: '🪔',
      bgColor: '#fff9c4',
      url: 'https://en.wikipedia.org/wiki/Diwali',
    },
    {
      id: '8',
      name: 'Christmas',
      date: 'December 25, 2025',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80', // Christmas tree
      icon: '🎄',
      bgColor: '#b3e5fc',
      url: 'https://en.wikipedia.org/wiki/Christmas',
    },
  ];

  // List View button handler
  const handleListViewPress = () => {
    // Clear any existing category/subcategory filter so list view loads all tickets
    dispatch(resetSelection());
    navigation.navigate('IncidentList');
  };

  // Siren Alert button handler
  

  
  const moreCategories = categories.slice(8);

  React.useEffect(() => {
    let scrollValue = 0;
    const interval = setInterval(() => {
      if (holidayScrollRef.current) {
        scrollValue += 220; // match minWidth of card
        if (scrollValue >= 220 * upcomingHolidays.length) {
          scrollValue = 0;
        }
        holidayScrollRef.current.scrollTo({ x: scrollValue, animated: true });
      }
    }, 5000); // 5 seconds for slower movement

    return () => clearInterval(interval); // Cleanup interval
  }, [upcomingHolidays.length]);

  useEffect(() => {
    const rows = 4;
    const extra = 48;
    const verticalGaps = 8 * rows;
    const winH = Dimensions.get('window').height;
    const available = winH - topBarH - headerH - moreBtnH - verticalGaps - extra;
    if (available > 0) {
      const h = Math.floor(available / rows);
      const clamped = Math.max(100, Math.min(h, 200));
      setTileH(clamped);
    }
  }, [topBarH, headerH, moreBtnH]);

  const holidays = upcomingHolidays;

  const flatListRef = useRef<FlatList>(null);
  const [_scrollIndex, setScrollIndex] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prev: number) => {
        let next = prev + scrollDirection;
        if (next >= holidays.length - 1) {
          setScrollDirection(-1);
          next = holidays.length - 1;
        } else if (next <= 0) {
          setScrollDirection(1);
          next = 0;
        }
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollDirection, holidays.length, setScrollIndex]);

  const sirenScale = useRef(new Animated.Value(1)).current;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#305377ff" />
      {/* Enhanced Header with Project Name, Subtitle, and List View Icon */}
      <View style={styles.topBarCustom} onLayout={(e) => setTopBarH(e.nativeEvent.layout.height)}>
        <View style={styles.flexCenter}>
          <Text style={styles.headingCustom}>RESOLVEZE</Text>
          <Text style={styles.subtitleCustom}>Your safety is our priority</Text>
        </View>
        <TouchableOpacity style={styles.listButtonCustom} onPress={handleListViewPress}>
          <Icon name="view-list" size={28} color="#0b31adff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Header row */}
            <View style={styles.headerRow} onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}>
              <Text style={styles.categoryHeadingText}>
                Select Incident Category
              </Text>
            </View>

            <View style={styles.incidentCategoryGrid}>
              {/* Render first 8 cards */}
              {categories.slice(0, 8).map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.incidentCategoryCard, tileH ? { height: tileH } : null]}
                  onPress={() => {
                    dispatch(selectCategory(cat));
                    navigation.navigate('Subcategory', { categoryId: cat.id });
                  }}
                  activeOpacity={0.85}
                >
                  {looksLikeIconName(cat.icon)
                    ? <MaterialIcons name={cat.icon as any} size={48} color="#145077" />
                    : <Text style={styles.incidentCategoryIcon}>{cat.icon || '📌'}</Text>}
                  <Text style={styles.incidentCategoryTitle} numberOfLines={2}>
                    {cat.title}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Show subcategories directly below main categories when dropdown is open */}
              {showDropdown && moreCategories.length > 0 && (
                moreCategories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.incidentCategoryCard, tileH ? { height: tileH } : null]}
                    onPress={() => { dispatch(selectCategory(cat)); navigation.navigate('Subcategory', { categoryId: cat.id }); }}
                    activeOpacity={0.85}
                  >
                    {looksLikeIconName(cat.icon)
                      ? <MaterialIcons name={cat.icon as any} size={48} color="#145077" />
                      : <Text style={styles.incidentCategoryIcon}>{cat.icon || '📌'}</Text>}
                    <Text style={styles.incidentCategoryTitle} numberOfLines={2}>{cat.title}</Text>
                  </TouchableOpacity>
                ))
              )}

              {/* More Categories Button always at the bottom */}
              {moreCategories.length > 0 && (
                <TouchableOpacity
                  style={[styles.dropdownButton, styles.dropdownButtonFull]}
                  onPress={() => setShowDropdown(prev => !prev)}
                  onLayout={(e) => setMoreBtnH(e.nativeEvent.layout.height)}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.dropdownButtonText, styles.dropdownButtonTextLeft]}>
                    More Categories ({moreCategories.length})
                  </Text>
                  <Text style={[styles.dropdownArrow, styles.dropdownArrowRight]}>
                    {showDropdown ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          {activeCategory && (
            <View style={styles.subcategoryPanel}>
              <Text style={styles.subcategoryHeading}>Select Subcategory</Text>
              <View style={styles.subcategoryGrid}>
                {activeCategory.subcategories.map((sub) => (
                  <TouchableOpacity
                    key={sub}
                    style={styles.subcategoryButton}
                    onPress={async () => {
                      dispatch(selectSubcategory(sub));
                      const { createTicket } = await import('../services/ticketService');
                      try {
                        const result = await createTicket({ incidentName: activeCategory.title, subcategory: sub });
                        navigation.navigate('SimpleTicketSuccess', {
                          incidentName: activeCategory.title,
                          subcategory: sub,
                          ticketId: result.ticketId,
                        });
                      } catch (e) {
                        navigation.navigate('SimpleTicketSuccess', {
                          incidentName: activeCategory.title,
                          subcategory: sub,
                          ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
                        });
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.subcategoryText}>{sub}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          </View>

          {/* Right Column - Side by Side Precautions */}
          <View style={styles.rightColumn}>
            {/* Emergency Contact One-liner */}
            <View style={styles.emergencyFeedCard}>
              <Text style={styles.emergencyFeedText}>
                🇮🇳 Emergency Contacts: 112 (All-in-one), 101 (Fire), 108 (Ambulance)
              </Text>
            </View>

            {/* Holiday Feed Section */}
            <View style={styles.holidaySection}>
              <Text style={styles.holidayFeedTitle}>Upcoming Events Feed</Text>
              {holidayFeed.map((item, index) => {
                const cardColor =
                  index === 0
                    ? '#ef4444' // Red for Independence Day
                    : index === 1
                    ? '#3b82f6' // Blue for Diwali
                    : '#22c55e'; // Green for Christmas

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.holidayFeedCard,
                      styles.feedCardBorderWidth,
                      { borderLeftColor: cardColor },
                    ]}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: cardColor }]}>
                      <Icon name="calendar" size={32} color="#fff" />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={[styles.holidayCardTitle, { color: cardColor }]}>
                        {item.title}
                      </Text>
                      <Text style={styles.holidayCardDate}>{item.date}</Text>
                      <Text style={styles.holidayCardDesc}>{item.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Time Card */}
            {/* <View style={styles.timeCard}>
              <View style={styles.timeContent}>
                <Text style={styles.timeIcon}>🕐</Text>
                <Text style={styles.timeText}>{currentTime}</Text>
              </View>
              <View style={styles.dateContent}>
                <Text style={styles.dateIcon}>📅</Text>
                <Text style={styles.dateText}>{currentDate}</Text>
              </View>
            </View> */}

            {/* Emergency Contacts */}
            {/* <View style={styles.emergencyCard}>
              <View style={styles.emergencyHeader}>
                <Text style={styles.emergencyIcon}>📞</Text>
                <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
              </View>
              <View style={styles.emergencyContent}>
                {emergencyContacts.map(contact => (
                  <View key={contact.id} style={styles.contactRow}>
                    <Text style={styles.contactName}>{contact.name}:</Text>
                    <Text style={styles.contactNumber}>{contact.number}</Text>
                  </View>
                ))}
              </View>
            </View> */}
            {/* Upcoming Holidays Carousel (moved below Emergency Contacts) */}
            {/* <View style={styles.upcomingHolidaysSection}>
              
              <View style={styles.holidayGridBackground}>
                <Text style={styles.upcomingHolidaysTitle}>
                Upcoming Holidays
              </Text>
                <FlatList
                  ref={flatListRef}
                  data={holidays}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.carouselContent}
                  renderItem={({ item }) => (
                    <View style={styles.holidayCard}>
                      <Image source={item.image} style={styles.holidayImage} resizeMode="cover" />
                      <Text style={styles.holidayName}>{item.name}</Text>
                      <Text style={styles.holidayDate}>{item.date}</Text>
                    </View>
                  )}
                  getItemLayout={(data, index) => (
                    {length: 200, offset: 200 * index, index}
                  )}
                />
              </View>
            </View> */}
            {/* We use a ref to the ScrollView and a useEffect to auto-scroll.
            <Animated.ScrollView
              ref={holidayScrollRef}
              ref={festivalScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              style={styles.festivalScroll}
            >
              {festivalImages.map((item, idx) => (
                <View key={idx} style={styles.festivalCard}>
                  <Image
                    source={{ uri: item.url }}
                    style={styles.festivalImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.festivalCardTitle}>{item.title}</Text>
                </View>
              ))}
            </Animated.ScrollView> */}

            {/* Upcoming Holidays Carousel */}
             <View style={styles.holidaySection}>
              {/* <Text style={styles.holidayTitle}>Upcoming Holidays</Text> */}
              {/* <Animated.ScrollView
                ref={holidayScrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                style={styles.holidayScroll}
              >
                {holidayImages.map((item, idx) => (
                  <View key={idx} style={styles.holidayCard}>
                    <Image
                      source={{ uri: item.url }}
                      style={styles.holidayImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.holidayCardTitle}>{item.title}</Text>
                  </View>
                ))}
              </Animated.ScrollView> */}
            </View> 
          </View>
        </View>
      </ScrollView>
      {/* Floating Emergency Alert Button with Glow and Pulse */}
      <Animated.View style={[styles.sirenButton, { transform: [{ scale: sirenScale }] }]}>
        <TouchableOpacity
          style={styles.sirenButtonInner}
          onPressIn={() => {
            Animated.spring(sirenScale, { toValue: 0.85, useNativeDriver: true }).start();
          }}
          onPressOut={() => {
            Animated.spring(sirenScale, { toValue: 1, useNativeDriver: true }).start();
            Alert.alert('Emergency Alert', 'Siren Activated!');
          }}
          accessibilityLabel="Activate Siren"
          activeOpacity={0.7}
        >
          <View style={styles.sirenEmojiContainer}>
            <Text style={styles.sirenEmoji}>🚨</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    alignItems: 'center',
  },
  holidayCardIcon: {
    //fontSize: 92, 
     width: 92,
     height: 100,
    textAlign: 'center',
    lineHeight: 100,
    fontSize: 98,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    },
  upcomingHolidaysSection: {
    marginTop: 6,
    marginBottom: 2,
  },
  upcomingHolidaysTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c5b85ff',
    marginLeft: 8,
    marginBottom: 8,
  },
  zIndex2: {
    zIndex: 2,
  },
  fabAlertButton: {
    position: 'absolute',
    right: 28,
    bottom: 38,
    backgroundColor: '#ff1744', 
    borderRadius: 48,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff1744',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
    zIndex: 100,
  },
  glowCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 23, 68, 0.45)',
    shadowColor: '#ff1744',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 32,
    elevation: 20,
    zIndex: 1,
  },
  ticketListSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  ticketListScroll: {
    maxHeight: 320,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#334155',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 32,
  },
  ticketRow: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
  },
  ticketRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ticketRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  ticketId: {
    fontWeight: 'bold',
    color: '#64748b',
    width: 80,
  },
  ticketStatus: {
    fontWeight: 'bold',
    color: '#3b82f6',
    width: 100,
    textTransform: 'capitalize',
  },
  ticketTitle: {
    flex: 1,
    color: '#334155',
  },
  ticketPriority: {
    color: '#f59e42',
    fontWeight: 'bold',
    width: 120,
  },
  ticketAssigned: {
    color: '#06b6d4',
    width: 140,
    fontWeight: 'bold',
  },
  ticketCreatedAt: {
    color: '#64748b',
    width: 120,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  // Custom top bar for heading, subtitle, and list view icon
  topBarCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginHorizontal: 10,
    marginBottom: 0,
    gap: 2,
  },
  headingCustom: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2907c4ff', // Strong blue
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: '#b6ccfa',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    marginBottom: 2,
    marginTop: 0,
  },
  subtitleCustom: {
    fontSize: 18,
    color: '#eead21ff', // Muted blue/gray
   fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 0,
  },
  listButtonCustom: {
    backgroundColor: '#e3e6ff',
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    marginBottom: 8,
    marginHorizontal: 10,

  },
  alertButtonCustom: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    backgroundColor: '#e53935',
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#e53935',
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    zIndex: 100,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(245, 245, 250, 1)',
  },
  header: {
    backgroundColor: 'rgb(255, 255, 255)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 18,
  },
  projectName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4f46e5', // Indigo
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: 1.5,
    textShadowColor: '#e0e7ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7c3aed', // Vivid purple
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flexDirection: width > 768 ? 'row' : 'column',
    padding: 2,
    paddingHorizontal: 20,
    gap: 6,
  },
  leftColumn: {
    flex: width > 768 ? 2 : undefined,
    gap: 8,
  },
  rightColumn: {
    flex: width > 768 ? 2 : undefined,
    padding: 12,
    gap: 16,
  },  
  timeCard: {
    backgroundColor: '#7595f3ff',
    borderRadius: 20,
    paddingVertical: 10, // Increased height
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  timeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  timeIcon: {
    fontSize: 32,
    marginRight: 12,
    color: '#fff',
  },
  timeText: {
    fontSize: 36, // Larger, airport style
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    fontFamily: 'monospace',
    textShadowColor: '#2f55d1ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateIcon: {
    fontSize: 24,
    marginRight: 8,
    color: '#fff',
  },
  dateText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '500',
    opacity: 0.85,
  },
  reportCard: {
    backgroundColor: '#dc143c',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  reportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reportIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc143c',
  },
  reportDescription: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  emergencyCard: {
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: 8,
    color: '#5a3e9f', // Dark purple
  },
  emergencyTitle: {
    fontWeight: 'bold',
    color: '#b91c1c',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emergencyContent: {
    gap: 8,
  },
  emergencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  emergencyButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 2,
  },
  emergencyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 16,
    color: '#5a3e9f', // Dark purple
    fontWeight: '500',
  },
  contactNumber: {
    fontSize: 16,
    color: '#333', // Dark gray for readability
    fontWeight: 'bold',
  },
  precautionsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  precautionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  precautionColumn: {
    flex: 1,
    gap: 8,
  },
  precautionSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  safetyIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  precautionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  safetyCard: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  precautionCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  precautionTextContainer: {
    flex: 1,
  },
  precautionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  precautionDescription: {
    fontSize: 10,
    color: '#6b7280',
  },
  requiredBadge: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  requiredText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  holidayCard: {
    backgroundColor: 'rgba(250, 246, 217, 1)',
    borderRadius: 20,
    padding: 10,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 280, // <-- Increase this value for taller cards
    minWidth: 580,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // holidayCardIcon: {
  //   //fontSize: 92, 
  //    width: 92,
  //    height: 100,
  //   textAlign: 'center',
  //   lineHeight: 92,
  //   fontSize: 98,
  //   color: '#fff',
  //   fontWeight: 'bold',
  //   marginBottom: 8,
    //},
  holidayCardInline: {
    borderRadius: 20,           // More rounded corners
    padding: 20,                // More padding for bigger card
    marginRight: 24,            // More space between cards
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 500,              // Increased horizontal width
    minHeight: 300,             // Taller card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  holidayCardInlineSmall: {
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  holidayCardGlow: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 18,
    borderWidth: 3,
    borderColor: '#fff8e1',
  },
  holidayLottie: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 10,
  },
  holidayImageStatic: {
    width: 140,
    height: 140,
    borderRadius: 24,
    marginBottom: 10,
    alignSelf: 'center',
  },
  holidayImageLarge: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  holidayImageSmall: {
    width: 180,
    height: 120,
    borderRadius: 16,
    marginBottom: 8,
    alignSelf: 'center',
  },
  holidayCardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#1c5b85',
  },
  holidayCardName: {
    fontSize: 28,               // Larger title
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  holidayCardDate: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  incidentListCard: {
    backgroundColor: '#6003bd',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  incidentListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  incidentListIcon: {
    fontSize: 24,
    marginRight: 12,
    color: '#6003bd',
    fontWeight: 'bold',
  },
  incidentListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38a7f1ff',
  },
  incidentListDescription: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  incidentCategoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1c5b85ff', // Blue
    textAlign: 'left',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 0,
  },
  incidentCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 0,
  
  },
  incidentCategoryCard: {
    width: '48%',
    height: 100,      // Add this line (adjust as needed)
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    backgroundColor: '#c3e7ff',
    overflow: 'hidden',
    shadowColor: '#9db3db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#b0d0ee',
    borderTopWidth: 1,
    borderTopColor: '#fff',
  },
  incidentCategoryCardPressed: {
    backgroundColor: '#e3f2fd', // lighter on press
  },
  incidentCategoryIcon: {
    fontSize: 48, // Reduce icon size for smaller cards
    marginBottom: 8,
    color: '#145077',
  },
  incidentCategoryTitle: {
    fontSize: 16, // Reduce title size for smaller cards
    fontWeight: 'bold',
    color: '#145077',
    textAlign: 'center',
  },
  subcategoryPanel: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  subcategoryHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c5b85ff',
    marginBottom: 12,
  },
  subcategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subcategoryButton: {
    width: '48%',
    minHeight: 64,
    backgroundColor: '#eaf4ff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#b3d4ff',
  },
  subcategoryText: {
    color: '#145077',
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 0,
    marginRight: 0,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f6faff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#cfe3ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  dropdownButtonFull: {
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  dropdownButtonText: {
    color: '#1c5b85ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdownButtonTextLeft: {
    flex: 1,
    textAlign: 'left',
  },
  dropdownArrow: {
    fontSize: 18,
    color: '#1c5b85ff',
    marginLeft: 0,
  },
  dropdownArrowRight: {
    textAlign: 'right',
  },
  dropdownOverlay: {
    marginTop: 10,
    marginBottom: 8,
  },
  holidaySection: {
    marginTop: 0,
    marginBottom: 0,
  },
  holidayGridBackground: {
    backgroundColor: '#daeaf8ff',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 8,
    shadowColor: '#8e24aa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 220, // <-- Increase this value for more height
  },
  carouselContent: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  // holidayCard: {
  //   width: width * 0.55,
  //   backgroundColor: '#fff',
  //   borderRadius: 16,
  //   marginRight: 16,
  //   alignItems: 'center',
  //   padding: 14,
  //   shadowColor: '#8e24aa',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.10,
  //   shadowRadius: 8,
  //   elevation: 2,
  // },
  holidayImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 10,
  },
  holidayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6d28d9',
    textAlign: 'center',
    marginBottom: 4,
  },
  holidayDate: {
    fontSize: 15,
    color: '#7c3aed',
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  categoryHeadingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c5b85ff',
    marginLeft: 8,
    marginTop: -10,
    // marginBottom: -10,
  },
  sirenButton: {
    position: 'absolute',
    right: 28,
    bottom: 38,
    backgroundColor: '#ff1744',
    borderRadius: 48,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff1744',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
    zIndex: 100,
  },
  sirenButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sirenEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#b91d44ff', // Red background
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff1744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  sirenEmoji: {
    fontSize: 32, // Emoji size
    color: '#fff', // White emoji color
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff', // white background
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 8,
    // Android shadow
    elevation: 6,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c5b85ff',
    textAlign: 'center',
  },
  emergencyFeedCard: {
    backgroundColor: '#ffe4e1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  emergencyFeedText: {
    color: '#b71c1c',
    fontWeight: 'bold',
    fontSize: 16,
    //textAlign: 'center',
  },
  holidayFeedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  holidayFeedCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  feedCardBorderRed: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444', // Red border for Independence Day
  },
  feedCardBorderBlue: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6', // Blue border for Diwali
  },
  feedCardBorderGreen: {
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e', // Green border for Christmas
  },
  feedCardBorderWidth: {
    borderLeftWidth: 4,
  },
  feedCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  holidayCardDesc: {
    fontSize: 13,
    color: '#374151',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
})

export default Home;