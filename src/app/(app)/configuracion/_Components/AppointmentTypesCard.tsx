"use client";

import { useMutation, useQuery } from "convex/react";
import { useId, useReducer } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Button, Card, Input, Label } from "@/components/ui";
import { mergeFormState, readableError } from "@/lib/form-state";
import { Check, Palette, Pencil, Trash2, X } from "lucide-react";

type TypeDraft = {
  editing: boolean;
  name: string;
  color: string;
  requiresPatient: boolean;
  tracksPayment: boolean;
  supportsReminder: boolean;
  defaultDurationMin: number;
  error: string;
};

type NewTypeDraft = Omit<TypeDraft, "editing">;

function draftFromType(type: Doc<"appointmentTypes">): TypeDraft {
  return {
    editing: false,
    name: type.name,
    color: type.color,
    requiresPatient: type.requiresPatient ?? true,
    tracksPayment: type.tracksPayment ?? true,
    supportsReminder: type.supportsReminder ?? true,
    defaultDurationMin: type.defaultDurationMin ?? 50,
    error: "",
  };
}

function TypeCapabilities({
  requiresPatient,
  tracksPayment,
  supportsReminder,
  onChange,
}: Pick<
  TypeDraft,
  "requiresPatient" | "tracksPayment" | "supportsReminder"
> & {
  onChange: (patch: Partial<TypeDraft>) => void;
}) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-stone-700">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={requiresPatient}
          onChange={(event) =>
            onChange({ requiresPatient: event.target.checked })
          }
          className="accent-teal-700"
        />
        Requiere paciente
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={tracksPayment}
          onChange={(event) =>
            onChange({ tracksPayment: event.target.checked })
          }
          className="accent-teal-700"
        />
        Registra pago
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={supportsReminder}
          onChange={(event) =>
            onChange({ supportsReminder: event.target.checked })
          }
          className="accent-teal-700"
        />
        Admite aviso
      </label>
    </div>
  );
}

function TypeRow({ type }: { type: Doc<"appointmentTypes"> }) {
  const durationId = useId();
  const updateType = useMutation(api.types.update);
  const removeType = useMutation(api.types.remove);
  const [draft, updateDraft] = useReducer(
    mergeFormState<TypeDraft>,
    draftFromType(type),
  );
  const {
    editing,
    name,
    color,
    requiresPatient,
    tracksPayment,
    supportsReminder,
    defaultDurationMin,
    error,
  } = draft;

  async function handleSave() {
    if (!name.trim()) return;
    updateDraft({ error: "" });
    try {
      await updateType({
        id: type._id,
        name: name.trim(),
        color,
        requiresPatient,
        tracksPayment,
        supportsReminder,
        defaultDurationMin,
      });
      updateDraft({ editing: false });
    } catch (caught) {
      updateDraft({ error: readableError(caught, "No se pudo actualizar.") });
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar el tipo "${type.name}"?`)) return;
    updateDraft({ error: "" });
    try {
      await removeType({ id: type._id });
    } catch (caught) {
      updateDraft({
        error:
          caught instanceof Error && caught.message.includes("turnos")
            ? "No se puede eliminar: hay turnos que usan este tipo."
            : "No se pudo eliminar.",
      });
    }
  }

  return (
    <li className="rounded-xl border border-stone-100 px-3 py-2 transition hover:border-stone-200">
      {editing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="color"
              aria-label={`Color de ${type.name}`}
              className="h-9 w-12 shrink-0 p-1"
              value={color}
              onChange={(event) => updateDraft({ color: event.target.value })}
            />
            <Input
              aria-label="Nombre del tipo de actividad"
              className="h-9"
              value={name}
              onChange={(event) => updateDraft({ name: event.target.value })}
              autoFocus
            />
          </div>
          <TypeCapabilities
            requiresPatient={requiresPatient}
            tracksPayment={tracksPayment}
            supportsReminder={supportsReminder}
            onChange={updateDraft}
          />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor={durationId} className="text-xs">
                Duración por defecto (min)
              </Label>
              <Input
                id={durationId}
                type="number"
                min={5}
                step={5}
                className="h-9"
                value={defaultDurationMin}
                onChange={(event) =>
                  updateDraft({
                    defaultDurationMin: Number(event.target.value),
                  })
                }
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSave()}
              className="rounded-lg p-2 text-teal-700 transition hover:bg-teal-50"
              aria-label="Guardar"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => updateDraft(draftFromType(type))}
              className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100"
              aria-label="Cancelar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span
            className="h-4 w-4 shrink-0 rounded-full shadow-sm ring-2 ring-white"
            style={{ backgroundColor: type.color }}
          />
          <span className="flex-1 truncate text-sm font-medium text-stone-800">
            {type.name}
          </span>
          {type.isPsychiatrist ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200/70">
              Psiquiatría
            </span>
          ) : null}
          <span className="hidden text-[11px] text-stone-400 sm:inline">
            {type.requiresPatient === false ? "Sin paciente" : "Paciente"} ·{" "}
            {type.defaultDurationMin ?? 50} min
          </span>
          <button
            type="button"
            onClick={() => updateDraft({ editing: true })}
            className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            aria-label="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {!type.isSystemType ? (
            <button
              type="button"
              onClick={() => void handleDelete()}
              className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
              aria-label="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      )}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </li>
  );
}

const initialNewTypeDraft: NewTypeDraft = {
  name: "",
  color: "#6366F1",
  requiresPatient: true,
  tracksPayment: true,
  supportsReminder: true,
  defaultDurationMin: 50,
  error: "",
};

export function AppointmentTypesCard() {
  const types = useQuery(api.types.list) ?? [];
  const createType = useMutation(api.types.create);
  const [draft, updateDraft] = useReducer(
    mergeFormState<NewTypeDraft>,
    initialNewTypeDraft,
  );
  const {
    name,
    color,
    requiresPatient,
    tracksPayment,
    supportsReminder,
    defaultDurationMin,
    error,
  } = draft;

  async function handleCreate(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || defaultDurationMin < 5) return;

    updateDraft({ error: "" });
    try {
      await createType({
        name: name.trim(),
        color,
        requiresPatient,
        tracksPayment,
        supportsReminder,
        defaultDurationMin,
      });
      updateDraft({ ...initialNewTypeDraft });
    } catch (caught) {
      updateDraft({ error: readableError(caught, "No se pudo crear el tipo.") });
    }
  }

  return (
    <Card className="p-5">
      <h2 className="mb-4 flex items-center gap-2 font-semibold">
        <Palette className="h-4 w-4 text-teal-700" />
        Tipos de actividad
      </h2>
      <ul className="mb-4 space-y-2">
        {types.map((type) => (
          <TypeRow key={type._id} type={type} />
        ))}
      </ul>
      <form
        onSubmit={handleCreate}
        className="space-y-3 rounded-2xl bg-stone-50 p-3"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            aria-label="Nombre del nuevo tipo de actividad"
            placeholder="Nuevo tipo..."
            value={name}
            onChange={(event) => updateDraft({ name: event.target.value })}
          />
          <Input
            type="color"
            aria-label="Color del nuevo tipo de actividad"
            className="h-11 w-full p-1 sm:w-20"
            value={color}
            onChange={(event) => updateDraft({ color: event.target.value })}
          />
          <Input
            type="number"
            min={5}
            step={5}
            aria-label="Duración por defecto en minutos"
            className="sm:w-28"
            value={defaultDurationMin}
            onChange={(event) =>
              updateDraft({ defaultDurationMin: Number(event.target.value) })
            }
          />
        </div>
        <TypeCapabilities
          requiresPatient={requiresPatient}
          tracksPayment={tracksPayment}
          supportsReminder={supportsReminder}
          onChange={updateDraft}
        />
        <Button
          type="submit"
          variant="outline"
          disabled={!name.trim() || defaultDurationMin < 5}
        >
          Agregar
        </Button>
        {error ? (
          <p role="alert" className="text-sm text-rose-700">
            {error}
          </p>
        ) : null}
      </form>
    </Card>
  );
}
