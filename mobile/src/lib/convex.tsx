import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/auralis";

const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const url = process.env.EXPO_PUBLIC_CONVEX_URL;
const client = url ? new ConvexReactClient(url) : null;

export function AuralisConvexProvider({ children }: { children: ReactNode }) {
  if (!client) {
    return (
      <View style={styles.missingConfig}>
        <Text style={styles.title}>Falta configurar Convex</Text>
        <Text style={styles.description}>
          Definí EXPO_PUBLIC_CONVEX_URL en mobile/.env.local y reiniciá Expo.
        </Text>
      </View>
    );
  }

  return (
    <ConvexAuthProvider client={client} storage={secureStorage}>
      {children}
    </ConvexAuthProvider>
  );
}

const styles = StyleSheet.create({
  missingConfig: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
