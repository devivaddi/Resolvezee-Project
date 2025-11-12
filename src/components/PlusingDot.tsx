"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Animated, StyleSheet } from "react-native"

interface PulsingDotProps {
  color?: string
  size?: number
}

const PulsingDot: React.FC<PulsingDotProps> = ({ color = "#10B981", size = 12 }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )
    pulse.start()

    return () => pulse.stop()
  }, [pulseAnim])

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          backgroundColor: color,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: 50,
  },
})

export default PulsingDot
