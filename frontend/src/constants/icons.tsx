import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const ICONS = {
  Dashboard: ({ size = 20, color = 'currentColor' }: IconProps) => (
    <MaterialIcons name="dashboard" size={size} color={color} />
  ),
  SMS: ({ size = 20, color = 'currentColor' }: IconProps) => (
    <MaterialIcons name="message" size={size} color={color} />
  ),
  Transactions: ({ size = 20, color = 'currentColor' }: IconProps) => (
    <MaterialIcons name="account-balance-wallet" size={size} color={color} />
  ),
  Settings: ({ size = 20, color = 'currentColor' }: IconProps) => (
    <MaterialIcons name="settings" size={size} color={color} />
  ),
};
