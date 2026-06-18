import * as yup from "yup";

/**
 * Centralisation de la contrainte « pas de date future ».
 * Toute date sélectionnée ou saisie doit être <= aujourd'hui.
 */

export const NO_FUTURE_DATE_MESSAGE =
  "La date ne peut pas être supérieure à la date du jour.";

/** Retourne la date du jour au format ISO YYYY-MM-DD (locale du navigateur). */
export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Date « maintenant » à 23:59:59.999 — utilisée comme borne pour DayPicker. */
export function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

/** True si la chaîne ISO YYYY-MM-DD est postérieure à aujourd'hui. */
export function isFutureIso(iso: string | undefined | null): boolean {
  if (!iso) return false;
  return iso > todayIso();
}

/** Props HTML standards pour un <input type="date"> bloquant les dates futures. */
export function maxTodayInputProps() {
  return { max: todayIso() } as const;
}

/**
 * Yup helper : interdit toute date ISO future.
 * Usage : yup.string().test(notFutureYupTest())
 */
export function notFutureYupTest() {
  return {
    name: "not-future-date",
    message: NO_FUTURE_DATE_MESSAGE,
    test: (value: string | undefined | null) => !isFutureIso(value),
  } as const;
}

/** Schéma Yup prêt à l'emploi pour un champ date ISO (YYYY-MM-DD) non futur. */
export const yupPastOrTodayDate = yup
  .string()
  .matches(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : YYYY-MM-DD")
  .test(notFutureYupTest());