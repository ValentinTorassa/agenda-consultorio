import { useAuthActions } from "@convex-dev/auth/react";
import { LockKeyhole, LogIn, Sparkles } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/constants/auralis";
import { PrimaryButton } from "@/components/auralis/ui";

export default function LoginScreen() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!email.trim() || password.length < 8 || loading) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.set("email", email.trim().toLowerCase());
      form.set("password", password);
      form.set("flow", "signIn");
      await signIn("password", form);
    } catch {
      setError("No se pudo ingresar. Revisá el email y la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.title}>Auralis</Text>
          <View style={styles.tagline}>
            <Sparkles color={colors.amber} size={15} />
            <Text style={styles.taglineText}>Turnos y consultorio, claros y a mano</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="tu@email.com"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete="current-password"
              secureTextEntry
              placeholder="Tu contraseña"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              onSubmitEditing={() => void submit()}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton disabled={loading} onPress={() => void submit()}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <LogIn color="white" size={20} />
                <Text style={styles.buttonText}>Ingresar</Text>
              </>
            )}
          </PrimaryButton>
          <View style={styles.security}>
            <LockKeyhole color={colors.teal} size={15} />
            <Text style={styles.securityText}>La sesión se guarda de forma segura en el dispositivo.</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1, justifyContent: "center", padding: 24 },
  hero: { alignItems: "center", marginBottom: 34 },
  logo: { width: 74, height: 74, borderRadius: 25, alignItems: "center", justifyContent: "center", backgroundColor: colors.teal, marginBottom: 16, shadowColor: colors.teal, shadowOpacity: 0.28, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  logoText: { color: "white", fontSize: 34, fontWeight: "900" },
  title: { color: colors.text, fontSize: 34, fontWeight: "800", letterSpacing: -1 },
  tagline: { marginTop: 7, flexDirection: "row", alignItems: "center", gap: 6 },
  taglineText: { color: colors.textMuted, fontSize: 14 },
  form: { borderRadius: 26, padding: 20, gap: 16, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  field: { gap: 6 },
  label: { color: colors.text, fontSize: 13, fontWeight: "700" },
  input: { minHeight: 50, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, color: colors.text, backgroundColor: colors.surfaceMuted, fontSize: 16 },
  error: { color: colors.rose, fontSize: 13, lineHeight: 19 },
  buttonText: { color: "white", fontSize: 15, fontWeight: "800" },
  security: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  securityText: { flexShrink: 1, color: colors.textMuted, fontSize: 11, textAlign: "center" },
});
