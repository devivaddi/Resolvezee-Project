import type React from "react"
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "success" | "warning" | "danger"
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", style, textStyle }) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.badgeText, styles[`${variant}Text`], textStyle]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  default: {
    backgroundColor: "#F3F4F6",
  },
  secondary: {
    backgroundColor: "#E5E7EB",
  },
  success: {
    backgroundColor: "#D1FAE5",
  },
  warning: {
    backgroundColor: "#FEF3C7",
  },
  danger: {
    backgroundColor: "#FEE2E2",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  defaultText: {
    color: "#374151",
  },
  secondaryText: {
    color: "#4B5563",
  },
  successText: {
    color: "#065F46",
  },
  warningText: {
    color: "#92400E",
  },
  dangerText: {
    color: "#991B1B",
  },
})
