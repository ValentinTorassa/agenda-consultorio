import { useQuery } from "convex/react";
import { Brain, Clock3, UserRound } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { api } from "@auralis/backend/api";
import { BrandHeader, EmptyState, LoadingState, Screen } from "@/components/auralis/ui";
import { colors } from "@/constants/auralis";
import { formatDateTime } from "@/lib/date";

export default function PsychiatristScreen() {
  const slots = useQuery(api.psychiatrist.listUpcoming);

  return (
    <Screen>
      <BrandHeader title="Psiquiatra" subtitle="Tercer viernes de cada mes · desde las 15:00" />
      <View style={styles.summary}>
        <Brain color={colors.amber} size={22} />
        <Text style={styles.summaryText}>
          {slots?.filter((slot) => !slot.patientId).length ?? 0} libres · {slots?.filter((slot) => slot.patientId).length ?? 0} asignados
        </Text>
      </View>

      {slots === undefined ? (
        <LoadingState />
      ) : slots.length === 0 ? (
        <EmptyState title="No hay horarios próximos" description="Generá los próximos meses desde la web de Auralis." />
      ) : (
        <View style={styles.list}>
          {slots.map((slot) => (
            <View key={slot._id} style={styles.slot}>
              <View style={[styles.status, slot.patientId ? styles.statusTaken : styles.statusFree]} />
              <View style={styles.content}>
                <View style={styles.timeRow}>
                  <Clock3 color={colors.amber} size={15} />
                  <Text style={styles.time}>{formatDateTime(slot.startTime)}</Text>
                </View>
                <View style={styles.patientRow}>
                  <UserRound color={colors.textMuted} size={14} />
                  <Text style={styles.patient}>{slot.patient?.fullName ?? "Horario libre"}</Text>
                </View>
              </View>
              <Text style={[styles.badge, slot.patientId ? styles.takenText : styles.freeText]}>
                {slot.patientId ? "Asignado" : "Libre"}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: colors.amberLight },
  summaryText: { color: "#92400E", fontSize: 13, fontWeight: "700" },
  list: { gap: 9 },
  slot: { minHeight: 76, borderRadius: 20, overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, flexDirection: "row", alignItems: "center", backgroundColor: colors.surface },
  status: { alignSelf: "stretch", width: 5 },
  statusFree: { backgroundColor: colors.green },
  statusTaken: { backgroundColor: colors.amber },
  content: { flex: 1, padding: 13, gap: 5 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  time: { color: colors.text, fontSize: 14, fontWeight: "700", textTransform: "capitalize" },
  patientRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  patient: { color: colors.textMuted, fontSize: 12 },
  badge: { marginRight: 12, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5, overflow: "hidden", fontSize: 10, fontWeight: "800" },
  freeText: { color: colors.green, backgroundColor: "#ECFDF5" },
  takenText: { color: "#B45309", backgroundColor: colors.amberLight },
});
