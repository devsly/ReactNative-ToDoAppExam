// src/theme/theme.js

export const colors = {
  primary: '#111111',        // Основен фон и основни бутони
  secondary: '#fafafa',      // Второстепенен фон 
  background: '#ffffff',     // Общ фон
  text: '#111111',           // Основен текст
  textSecondary: '#666666',  // Подтекст 
  border: '#dddddd',         // Граници на Card / Input
  danger: '#d32f2f',         // High priority / Delete
  warning: '#f57c00',        // Medium priority
  success: '#388e3c',        // Low priority
  accent: '#1976d2',         // За акценти и бутони
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontSizes = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 22,
  xxl: 28,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  round: 999, // за кръгли елементи 
};

// Цветове за приоритети на задачите
export const priorityColors = {
  high: colors.danger,
  medium: colors.warning,
  low: colors.success,
};

// Стандартни бутони
export const button = {
  primary: {
    backgroundColor: colors.primary,
    color: '#fff',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  danger: {
    backgroundColor: colors.danger,
    color: '#fff',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
};

export const timePicker = {
  dateBtn: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.secondary,
  },
  dateBtnText: {
    color: colors.text,
    fontWeight: '700',
  },
}
