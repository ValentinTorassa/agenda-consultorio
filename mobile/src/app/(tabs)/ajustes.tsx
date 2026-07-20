import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import Constants from "expo-constants";
import { ExternalLink, LockKeyhole, LogOut, ShieldCheck, Smartphone } from "lucide-react-native";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { api } from "@auralis/backend/api";
import { BrandHeader, Card, PrimaryButton, Screen, SectionTitle } from "@/components/auralis/ui";
import { colors } from "@/constants/auralis";

export default function SettingsScreen() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.me);

  return (
    <Screen>
      <BrandHeader title="Ajustes" subtitle="Seguridad y aplicación" />

      <Card>
        <SectionTitle>Cuenta</SectionTitle>
        <Text style={styles.userName}>{user?.name ?? "Usuario de Auralis"}</Text>
        <Text style={styles.userEmail}>{user?.email ?? "Sesión protegida"}</Text>
      </Card>

      <Card>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <LockKeyhole color={colors.teal} size={20} />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Almacenamiento seguro</Text>
            <Text style={styles.infoDescription}>La sesión se guarda en SecureStore, no en almacenamiento común.</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <ShieldCheck color={colors.teal} size={20} />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Mismos datos, en tiempo real</Text>
            <Text style={styles.infoDescription}>Web y mobile usan la misma cuenta y el mismo backend Convex.</Text>
          </View>
        </View>
      </Card>

      <Pressable style={styles.webLink} onPress={() => void Linking.openURL("https://turnos.valentorassa.com")}>
        <Smartphone color={colors.violet} size={20} />
        <Text style={styles.webText}>Abrir Auralis Web</Text>
        <ExternalLink color={colors.textMuted} size={17} />
      </Pressable>

      <PrimaryButton onPress={() => void signOut()} style={styles.signOut}>
        <LogOut color="white" size={19} />
        <Text style={styles.signOutText}>Cerrar sesión</Text>
      </PrimaryButton>

      <Text style={styles.version}>Auralis Mobile {Constants.expoConfig?.version ?? "1.0.0"}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  userName: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 12 },
  userEmail: { color: colors.textMuted, fontSize: 13, marginTop: 3 },
  infoRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  infoIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.tealLight },
  infoText: { flex: 1 },
  infoTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  infoDescription: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: 14 },
  webLink: { minHeight: 54, borderRadius: 18, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  webText: { flex: 1, color: colors.text, fontSize: 14, fontWeight: "700" },
  signOut: { backgroundColor: colors.rose },
  signOutText: { color: "white", fontSize: 15, fontWeight: "800" },
  version: { color: colors.textMuted, fontSize: 11, textAlign: "center" },
});
