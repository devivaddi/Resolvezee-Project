import type React from "react"
import { Text } from "react-native"

interface IconProps {
  size?: number
  color?: string
}

export const Clock: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
  <Text style={{ fontSize: size, color }}>🕐</Text>
)

export const Calendar: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
  <Text style={{ fontSize: size, color }}>📅</Text>
)

export const FileText: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
  <Text style={{ fontSize: size, color }}>📄</Text>
)

export const Phone: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
  <Text style={{ fontSize: size, color }}>📞</Text>
)

export const AlertTriangle: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
  <Text style={{ fontSize: size, color }}>⚠️</Text>
)

export const Shield: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
  <Text style={{ fontSize: size, color }}>🛡️</Text>
)

export const X: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
  <Text style={{ fontSize: size, color }}>✕</Text>
)

export const Camera: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
  <Text style={{ fontSize: size, color }}>📷</Text>
)

export const MapPin: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
  <Text style={{ fontSize: size, color }}>📍</Text>
)
