import { useQuery } from "convex/react";
import { MessageCircle, Search, UserRound } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { api } from "@auralis/backend/api";
import { BrandHeader, EmptyState, LoadingState, Screen } from "@/components/auralis/ui";
import { colors } from "@/constants/auralis";
import { whatsappUrl } from "@/lib/phone";

export default function PatientsScreen() {
  const patients = useQuery(api.patients.list);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!patients || !term) return patients ?? [];
    return patients.filter((patient) => patient.fullNameLower.includes(term));
  }, [patients, search]);

  return (
    <Screen>
      <BrandHeader title="Pacientes" subtitle={`${patients?.length ?? 0} fichas administrativas`} />
      <View style={styles.search}>
        <Search color={colors.textMuted} size={19} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por apellido o nombre..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      {patients === undefined ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "Sin coincidencias" : "Todavía no hay pacientes"}
          description="Las fichas creadas en la web aparecen acá en tiempo real."
        />
      ) : (
        <View style={styles.list}>
          {filtered.map((patient) => (
            <View key={patient._id} style={styles.patient}>
              <View style={styles.avatar}>
                <UserRound color={colors.teal} size={21} />
              </View>
              <View style={styles.patientInfo}>
                <Text style={styles.name} numberOfLines={1}>{patient.fullName}</Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {patient.careType}{patient.phone ? ` · ${patient.phone}` : ""}
                </Text>
              </View>
              {patient.phone ? (
                <Pressable
                  accessibilityLabel={`Abrir WhatsApp con ${patient.fullName}`}
                  onPress={() => void Linking.openURL(whatsappUrl(patient.phone!))}
                  style={styles.whatsapp}
                >
                  <MessageCircle color={colors.green} size={21} />
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { minHeight: 50, borderRadius: 17, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: colors.surface },
  searchInput: { flex: 1, color: colors.text, fontSize: 15 },
  list: { gap: 9 },
  patient: { minHeight: 72, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, padding: 12, flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: colors.surface },
  avatar: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.tealLight },
  patientInfo: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: "700" },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  whatsapp: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#ECFDF5" },
});
