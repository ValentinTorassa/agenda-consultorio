import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type ScrollViewProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/constants/auralis";

export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  ...props
}: ScrollViewProps & {
  children: ReactNode;
  scroll?: boolean;
}) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.screenContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.screenContent, styles.flex, contentContainerStyle]}>
      {children}
    </View>
  );

  return <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>;
}

export function BrandHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.brandMark}>
        <Text style={styles.brandLetter}>A</Text>
      </View>
      <View style={styles.headerText}>
        <Text style={styles.eyebrow}>AURALIS</Text>
        <Text style={styles.heading}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({
  children,
  disabled,
  style,
  ...props
}: PressableProps & { children: ReactNode }) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryButton,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style as ViewStyle,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {description ? <Text style={styles.emptyDescription}>{description}</Text> : null}
    </View>
  );
}

export function LoadingState() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.teal} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  screenContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 112,
    gap: 16,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 4 },
  brandMark: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.teal,
    shadowColor: colors.teal,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  brandLetter: { color: "white", fontSize: 22, fontWeight: "800" },
  headerText: { flex: 1 },
  eyebrow: { color: colors.teal, fontSize: 11, fontWeight: "800", letterSpacing: 1.4 },
  heading: { color: colors.text, fontSize: 26, lineHeight: 31, fontWeight: "800" },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#1C1917",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.teal,
    paddingHorizontal: 18,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: "700" },
  empty: {
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    padding: 24,
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
  },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: "700" },
  emptyDescription: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    textAlign: "center",
  },
  loading: { paddingVertical: 48, alignItems: "center" },
});
