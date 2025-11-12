"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { TouchableOpacity, Text, StyleSheet, Animated, type ViewStyle } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

interface FloatingActionButtonProps {
  onPress: () => void
  icon: string
  label: string
  backgroundColor?: string
  delay?: number
  style?: ViewStyle
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  label,
  backgroundColor = "#3B82F6",
  delay = 0,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: delay + 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [delay])

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
    onPress()
  }

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={handlePress} activeOpacity={0.8}>
        <Icon name={icon} size={20} color="white" />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default FloatingActionButton
