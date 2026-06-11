import { useEffect, useState } from "react";
import { useForm, type FieldValues, type DefaultValues, type Path } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type * as Yup from "yup";
import { Box, Button, MenuItem, Stack, TextField, FormControlLabel, Switch } from "@mui/material";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { evaluatePassword } from "@/utils/password";
import { Check, X } from "lucide-react";
import { LoadingButton } from "@/components/LoadingButton";

export type FieldType = "text" | "number" | "select" | "boolean" | "date" | "datepicker" | "password";

export interface FieldDef {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  hidden?: boolean;
  helperText?: string;
  readOnly?: boolean;
  action?: { label: string; onClick: () => string };
  compute?: (values: Record<string, unknown>) => string;
  showCriteria?: boolean;
}

export interface DynamicFormProps<T extends FieldValues> {
  fields: FieldDef[];
  schema: Yup.AnyObjectSchema;
  defaultValues: DefaultValues<T>;
  onSubmit: (values: T) => void | Promise<unknown>;
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function DynamicForm<T extends FieldValues>({
  fields, schema, defaultValues, onSubmit, onCancel,
  submitLabel = "Enregistrer", loading,
}: DynamicFormProps<T>) {

  const {
    register, handleSubmit, reset, watch, setValue,
    formState: { errors },
  } = useForm<T>({
    resolver: yupResolver(schema) as never,
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => { reset(defaultValues); }, [defaultValues, reset]);

  const [submitting, setSubmitting] = useState(false);
  const busy = loading || submitting;

  const submitWrapper = handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      await onSubmit(values as T);
    } finally {
      setSubmitting(false);
    }
  });

  const values = watch();

  useEffect(() => {
    for (const f of fields) {
      if (!f.compute) continue;
      const next = f.compute(values as Record<string, unknown>);
      const current = (values as Record<string, unknown>)[f.name];
      if (next !== current) {
        setValue(f.name as Path<T>, next as never, { shouldValidate: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  return (
    <Box component="form" onSubmit={submitWrapper} noValidate>
      <Stack spacing={2}>
        {fields.filter((f) => !f.hidden).map((f) => {
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

          if (f.type === "select") {
            return (
              <TextField
                key={f.name}
                select
                label={f.label}
                required={f.required}
                value={(values as Record<string, unknown>)[f.name] ?? ""}
                onChange={(e) => setValue(f.name as Path<T>, e.target.value as never, { shouldValidate: true })}
                error={!!errorMsg}
                helperText={errorMsg || f.helperText}
                fullWidth
              >
                {(f.options ?? []).map((o) => (
                  <MenuItem key={String(o.value)} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>
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

          if (f.type === "password") {
            return (
              <Stack key={f.name} spacing={1}>
                <TextField
                  label={f.label}
                  type="password"
                  required={f.required}
                  disabled={f.readOnly}
                  {...register(f.name as Path<T>)}
                  error={!!errorMsg}
                  helperText={errorMsg || f.helperText}
                  fullWidth
                  InputProps={{ readOnly: f.readOnly }}
                />
                {f.action && (
                  <Button
                    type="button"
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const next = f.action!.onClick();
                      setValue(f.name as Path<T>, next as never, { shouldValidate: true });
                    }}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    {f.action.label}
                  </Button>
                )}
                {f.showCriteria && (
                  <ul className="text-xs space-y-1 mt-1 list-none p-0">
                    {evaluatePassword(String((values as Record<string, unknown>)[f.name] ?? "")).map((c) => (
                      <li key={c.key} className={cn("flex items-center gap-1.5", c.ok ? "text-green-600" : "text-muted-foreground")}>
                        {c.ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        <span>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Stack>
            );
          }

          return (
            <TextField
              key={f.name}
              label={f.label}
              type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
              required={f.required}
              {...register(f.name as Path<T>, {
                valueAsNumber: f.type === "number",
              })}
              error={!!errorMsg}
              helperText={errorMsg || f.helperText}
              InputLabelProps={f.type === "date" ? { shrink: true } : undefined}
              InputProps={{ readOnly: f.readOnly }}
              fullWidth
            />
          );
        })}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {onCancel && (
            <Button type="button" onClick={onCancel} disabled={busy}>Annuler</Button>
          )}
          <LoadingButton type="submit" variant="contained" loading={busy}>{submitLabel}</LoadingButton>
        </Stack>
      </Stack>
    </Box>
  );
}