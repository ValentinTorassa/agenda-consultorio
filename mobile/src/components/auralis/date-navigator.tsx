import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/auralis";
import {
  addDays,
  dateFromKey,
  formatShortDate,
  keyFromDate,
  todayKey,
} from "@/lib/date";

export function DateNavigator({
  date,
  onChange,
}: {
  date: string;
  onChange: (date: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const isToday = date === todayKey();

  function handlePicker(event: DateTimePickerEvent, value?: Date) {
    if (Platform.OS === "android") setShowPicker(false);
    if (event.type === "set" && value) onChange(keyFromDate(value));
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Pressable style={styles.arrow} onPress={() => onChange(addDays(date, -1))}>
          <ChevronLeft color={colors.textMuted} size={20} />
        </Pressable>
        <Pressable style={styles.dateButton} onPress={() => setShowPicker((value) => !value)}>
          <CalendarDays color={colors.violet} size={17} />
          <Text style={styles.dateText}>{isToday ? "Hoy" : formatShortDate(date)}</Text>
        </Pressable>
        <Pressable style={styles.arrow} onPress={() => onChange(addDays(date, 1))}>
          <ChevronRight color={colors.textMuted} size={20} />
        </Pressable>
        {!isToday ? (
          <Pressable style={styles.todayButton} onPress={() => onChange(todayKey())}>
            <Text style={styles.todayText}>Hoy</Text>
          </Pressable>
        ) : null}
      </View>
      {showPicker ? (
        <DateTimePicker
          value={dateFromKey(date)}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handlePicker}
          accentColor={colors.teal}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  row: {
    minHeight: 44,
    borderRadius: 16,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceMuted,
  },
  arrow: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  dateButton: {
    flex: 1,
    minHeight: 36,
    borderRadius: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.surface,
  },
  dateText: { color: colors.text, fontSize: 14, fontWeight: "700", textTransform: "capitalize" },
  todayButton: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9, backgroundColor: colors.tealLight },
  todayText: { color: colors.teal, fontSize: 12, fontWeight: "800" },
});
