import { useMutation, useQuery } from "convex/react";
import { Check, Plus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { api } from "@auralis/backend/api";
import { colors } from "@/constants/auralis";
import { Card, EmptyState, SectionTitle } from "./ui";

export function TaskList({ date }: { date: string }) {
  const tasks = useQuery(api.tasks.byDate, { date }) ?? [];
  const create = useMutation(api.tasks.create);
  const toggle = useMutation(api.tasks.toggle);
  const remove = useMutation(api.tasks.remove);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function addTask() {
    const value = title.trim();
    if (!value || saving) return;
    setSaving(true);
    try {
      await create({ date, title: value });
      setTitle("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <View style={styles.headingRow}>
        <SectionTitle>Tareas</SectionTitle>
        <Text style={styles.counter}>{tasks.filter((task) => !task.done).length} pendientes</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={() => void addTask()}
          placeholder="Nueva tarea..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
          style={styles.input}
        />
        <Pressable
          accessibilityLabel="Agregar tarea"
          disabled={!title.trim() || saving}
          onPress={() => void addTask()}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed, (!title.trim() || saving) && styles.disabled]}
        >
          <Plus color="white" size={21} strokeWidth={2.6} />
        </Pressable>
      </View>
      {tasks.length === 0 ? (
        <EmptyState title="Sin tareas" description="Agregá lo que no querés olvidar ese día." />
      ) : (
        <View style={styles.list}>
          {tasks.map((task) => (
            <View key={task._id} style={styles.task}>
              <Pressable
                accessibilityLabel={task.done ? "Marcar pendiente" : "Marcar realizada"}
                onPress={() => void toggle({ id: task._id })}
                style={[styles.checkbox, task.done && styles.checkboxDone]}
              >
                <Check color={task.done ? "white" : "transparent"} size={16} strokeWidth={3} />
              </Pressable>
              <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>{task.title}</Text>
              <Pressable accessibilityLabel="Eliminar tarea" onPress={() => void remove({ id: task._id })} style={styles.deleteButton}>
                <Trash2 color={colors.textMuted} size={17} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  headingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  counter: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  form: { flexDirection: "row", gap: 8, marginBottom: 14 },
  input: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 14,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: 15,
  },
  addButton: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.teal },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.4 },
  list: { gap: 8 },
  task: { minHeight: 48, borderRadius: 16, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.surfaceMuted },
  checkbox: { width: 28, height: 28, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  checkboxDone: { borderColor: colors.teal, backgroundColor: colors.teal },
  taskTitle: { flex: 1, color: colors.text, fontSize: 14, fontWeight: "600" },
  taskTitleDone: { color: colors.textMuted, textDecorationLine: "line-through" },
  deleteButton: { padding: 8 },
});
