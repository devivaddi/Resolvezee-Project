import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { RootStackParamList } from '../types/navigation';
import { selectCategory, toggleDropdown } from '../store/slices/incidentSlice';
import IncidentCard from '../components/IncidentCard';
import { IncidentCategory } from '../store/slices/incidentSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Helper function to check if a string is an emoji
const isEmoji = (str: string) => {
  const emojiRegex = /\p{Emoji}/u;
  return emojiRegex.test(str);
};

type IncidentCategoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'IncidentCategory'
>;

interface Props {
  navigation: IncidentCategoryScreenNavigationProp;
}

const IncidentCategoryScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { categories, visibleCards, showDropdown } = useAppSelector(
    (state) => state.incident
  );

  const [, setSelectedDropdownCategory] = useState<string>('');
  const animatedValues = useRef(categories.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animatedValues.map((animatedValue, index) =>
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 600,
        delay: index * 50,
        useNativeDriver: true,
      })
    );
    Animated.stagger(25, animations).start();
  }, [animatedValues]);

  const visibleCategories = categories.slice(0, visibleCards);
  const remainingCategories = categories.slice(visibleCards);

  const handleCardPress = (category: IncidentCategory) => {
    dispatch(selectCategory(category));
    navigation.navigate('Subcategory', { categoryId: category.id });
  };

  const handleDropdownSelect = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      handleCardPress(category);
    }
    setSelectedDropdownCategory('');
    dispatch(toggleDropdown());
  };

  const renderCard = ({ item, index }: { item: IncidentCategory; index: number }) => (
    <IncidentCard
      category={item}
      onPress={() => handleCardPress(item)}
      animatedValue={animatedValues[index]}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.customHeaderTitle}>Report Incident</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={visibleCategories}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={4}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />

        {remainingCategories.length > 0 && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => dispatch(toggleDropdown())}
            >
              <Text style={styles.dropdownButtonText}>
                More Categories ({remainingCategories.length})
              </Text>
              <Text style={styles.dropdownArrow}>
                {showDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownList}>
                {remainingCategories.map((category, index) => (
                  <TouchableOpacity
                    key={`${category.id}-${index}`}
                    style={styles.dropdownItem}
                    onPress={() => handleDropdownSelect(category.id)}
                  >
                    <View style={styles.dropdownItemContent}>
                      {isEmoji(category.icon) ? (
                        <Text style={styles.dropdownEmojiIcon}>
                          {category.icon}
                        </Text>
                      ) : (
                        <MaterialIcons 
                          name={category.icon as any} 
                          size={36} // Increased icon size
                          color="#333" 
                          style={styles.dropdownIcon} 
                        />
                      )}
                      <Text style={styles.dropdownItemText}>{category.title}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  customHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dropdownContainer: {
    marginTop: 20,
    backgroundColor: 'rgb(236, 236, 236)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  dropdownButton: {
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 20,
    borderRadius: 16,
    borderColor: 'rgb(201, 207, 236)',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(25, 3, 150)',
  },
  dropdownArrow: {
    fontSize: 24,
    color: 'rgb(29, 0, 190)',
  },
  dropdownList: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 6,
    shadowColor: 'rgb(38, 0, 175)',
    shadowOffset: {
      width: 20,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(230, 230, 230)',
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  dropdownEmojiIcon: {
    fontSize: 36, // Increased emoji size
    marginRight: 16,
  },
  dropdownItemText: {
    fontSize: 18,
    color: 'rgb(9, 29, 49)',
    fontWeight: '500',
  },
});

export default IncidentCategoryScreen;