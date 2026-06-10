import { useState } from "react";
import { useForm, type FieldValues, type DefaultValues, type Path } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type * as Yup from "yup";
import {
  Box, Button, MenuItem, Stack, Step, StepLabel, Stepper, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, Divider,
  FormControlLabel, Switch,
} from "@mui/material";
import type { FieldDef } from "./DynamicForm";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LoadingButton } from "@/components/LoadingButton";

export interface StepDef {
  label: string;
  fields: FieldDef[];
}

export interface StepperFormProps<T extends FieldValues> {
  steps: StepDef[];
  schema: Yup.AnyObjectSchema;
  defaultValues: DefaultValues<T>;
  onSubmit: (values: T) => void | Promise<unknown>;
  onCancel?: () => void;
  loading?: boolean;
  summaryLabels?: Record<string, string>;
}

export function StepperForm<T extends FieldValues>({
  steps, schema, defaultValues, onSubmit, onCancel, loading, summaryLabels = {},
}: StepperFormProps<T>) {
  const [active, setActive] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const busy = Boolean(loading || submitting);

  const {
    register, handleSubmit, watch, setValue, trigger,
    formState: { errors },
  } = useForm<T>({
    resolver: yupResolver(schema) as never,
    defaultValues,
    mode: "onChange",
  });

  const values = watch();

  const next = async () => {
    const names = steps[active].fields.map((f) => f.name as Path<T>);
    const ok = await trigger(names);
    if (ok) setActive((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => setActive((s) => Math.max(0, s - 1));

  const handleFinish = async () => {
    const ok = await trigger();
    if (ok) setShowSummary(true);
  };

  const submitWrapper = handleSubmit(async (formValues) => {
    try {
      setSubmitting(true);
      await onSubmit(formValues as T);
    } finally {
      setSubmitting(false);
    }
  });

  const renderField = (f: FieldDef) => {
    const err = (errors as Record<string, { message?: string } | undefined>)[f.name];
    const errorMsg = err?.message;

    if (f.type === "boolean") {
      return (
        <FormControlLabel
          key={f.name}
          control={
            <Switch
              checked={Boolean((values as Record<string, unknown>)[f.name])}
              onChange={(_, v) => setValue(f.name as Path<T>, v as never, { shouldValidate: true })}
            />
          }
          label={f.label}
        />
      );
    }
    if (f.type === "datepicker") {
      const raw = (values as Record<string, unknown>)[f.name];
      const selected = typeof raw === "string" && raw ? new Date(raw + "T00:00:00") : undefined;
      return (
        <div key={f.name} className="flex flex-col gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <ShadcnButton
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selected && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selected ? format(selected, "dd/MM/yyyy") : f.label}
              </ShadcnButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-1 pointer-events-auto"
              style={{ zIndex: 2000 }}
              align="start"
            >
              <Calendar
                mode="single"
                selected={selected}
                onSelect={(date) => {
                  const iso = date ? format(date, "yyyy-MM-dd") : "";
                  setValue(f.name as Path<T>, iso as never, { shouldValidate: true });
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {errorMsg && <span className="text-xs text-red-500">{errorMsg}</span>}
        </div>
      );
    }
    if (f.type === "select") {
      return (
        <TextField
          key={f.name} select fullWidth required={f.required}
          label={f.label}
          value={(values as Record<string, unknown>)[f.name] ?? ""}
          onChange={(e) => setValue(f.name as Path<T>, e.target.value as never, { shouldValidate: true })}
          error={!!errorMsg} helperText={errorMsg || f.helperText}
        >
          {(f.options ?? []).map((o) => (
            <MenuItem key={String(o.value)} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
      );
    }
    return (
      <TextField
        key={f.name} fullWidth required={f.required}
        label={f.label}
        type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
        InputLabelProps={f.type === "date" ? { shrink: true } : undefined}
        {...register(f.name as Path<T>, { valueAsNumber: f.type === "number" })}
        error={!!errorMsg} helperText={errorMsg || f.helperText}
      />
    );
  };

  return (
    <Box component="form" onSubmit={submitWrapper}>
      <Stepper activeStep={active} sx={{ mb: 3 }}>
        {steps.map((s) => (
          <Step key={s.label}><StepLabel>{s.label}</StepLabel></Step>
        ))}
      </Stepper>

      <Stack spacing={2}>
        {steps[active].fields.map(renderField)}
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
        <Box>
          {onCancel && active === 0 && <Button onClick={onCancel} disabled={busy}>Annuler</Button>}
          {active > 0 && <Button onClick={back} disabled={busy}>Précédent</Button>}
        </Box>
        <Box>
          {active < steps.length - 1 ? (
            <Button onClick={next} variant="contained" disabled={busy}>Suivant</Button>
          ) : (
            <Button onClick={handleFinish} variant="contained" disabled={busy}>
              Voir le résumé
            </Button>
          )}
        </Box>
      </Stack>

      <Dialog open={showSummary} onClose={() => { if (!busy) setShowSummary(false); }} maxWidth="sm" fullWidth>
        <DialogTitle>Résumé avant enregistrement</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Veuillez vérifier les informations avant de confirmer.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1}>
            {Object.entries(values as Record<string, unknown>).map(([k, v]) => (
              <Stack key={k} direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">{summaryLabels[k] ?? k}</Typography>
                <Typography variant="body2" fontWeight={600}>{String(v ?? "—")}</Typography>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSummary(false)} disabled={busy}>Modifier</Button>
          <LoadingButton
            variant="contained"
            loading={busy}
            loadingLabel="Enregistrement..."
            onClick={async () => { await submitWrapper(); }}
          >
            Confirmer et enregistrer
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}