import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  View,
  Animated,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IncidentCategory } from '../store/slices/incidentSlice';

interface IncidentCardProps {
  category: IncidentCategory;
  onPress: (category: IncidentCategory) => void;
  animatedValue?: Animated.Value;
}

const { width } = Dimensions.get('window');
// 4 cards per row with proper spacing for gloved workers
const cardWidth = (width - 80) / 4; // 80 = padding + margins
const cardHeight = 140; // Bigger height for better touch targets

// Helper function to check if a string is an emoji
const isEmoji = (str: string) => {
  // Regex to match emojis
  const emojiRegex = /\p{Emoji}/u;
  return emojiRegex.test(str);
};

const IncidentCard: React.FC<IncidentCardProps> = ({ 
  category, 
  onPress, 
  animatedValue = new Animated.Value(1) 
}) => {
  const animatedStyle = {
    opacity: animatedValue,
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: category.color }]}
        onPress={() => onPress(category)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {isEmoji(category.icon) ? (
            <Text style={styles.emojiIcon}>{category.icon}</Text>
          ) : (
            <MaterialIcons 
              name={category.icon as any} 
              size={32} 
              color="#fff" 
              style={styles.icon} 
            />
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={3}>
            {category.title}
          </Text>
        </View>
        <View style={styles.touchIndicator}>
          <View style={styles.touchDot} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    // Minimum touch target size for accessibility
    minHeight: 44,
    minWidth: 44,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    textAlign: 'center',
  },
  emojiIcon: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  touchIndicator: {
    alignItems: 'center',
    marginTop: 4,
  },
  touchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default IncidentCard;