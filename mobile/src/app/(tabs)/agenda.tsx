import { useQuery } from "convex/react";
import { CalendarRange } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { api } from "@auralis/backend/api";
import { AppointmentCard } from "@/components/auralis/appointment-card";
import { DateNavigator } from "@/components/auralis/date-navigator";
import { TaskList } from "@/components/auralis/task-list";
import {
  BrandHeader,
  EmptyState,
  LoadingState,
  Screen,
  SectionTitle,
} from "@/components/auralis/ui";
import { colors } from "@/constants/auralis";
import { formatDate, todayKey } from "@/lib/date";

export default function AgendaScreen() {
  const [date, setDate] = useState(() => todayKey());
  const appointments = useQuery(api.appointments.byDay, { date });

  return (
    <Screen>
      <BrandHeader title="Agenda" subtitle={formatDate(date)} />
      <DateNavigator date={date} onChange={setDate} />

      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <CalendarRange color={colors.teal} size={19} />
        </View>
        <SectionTitle>Turnos del día</SectionTitle>
        <Text style={styles.count}>{appointments?.length ?? 0}</Text>
      </View>

      {appointments === undefined ? (
        <LoadingState />
      ) : appointments.length === 0 ? (
        <EmptyState title="Día libre" description="No hay turnos cargados para esta fecha." />
      ) : (
        <View style={styles.list}>
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment._id} appointment={appointment} />
          ))}
        </View>
      )}

      <TaskList date={date} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 9 },
  sectionIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.tealLight },
  count: { marginLeft: "auto", minWidth: 28, textAlign: "center", color: colors.teal, fontSize: 12, fontWeight: "800", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: colors.tealLight },
  list: { gap: 10 },
});
