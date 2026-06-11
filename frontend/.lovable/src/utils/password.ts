// Password rules: min 8 chars, >=1 upper, >=1 lower, >=1 special, max 2 specials.
// Allowed specials: ! @ # $ % ^ & * _ - +
export const SPECIAL_CHARS = "!@#$%^&*_-+";
const SPECIAL_REGEX = /[!@#$%^&*_\-+]/g;

export interface PasswordCriterion {
  key: string;
  label: string;
  ok: boolean;
}

export function evaluatePassword(pwd: string): PasswordCriterion[] {
  const v = pwd ?? "";
  const specials = (v.match(SPECIAL_REGEX) ?? []).length;
  return [
    { key: "len", label: "Au minimum 8 caractères", ok: v.length >= 8 },
    { key: "upper", label: "Au moins une lettre majuscule (A-Z)", ok: /[A-Z]/.test(v) },
    { key: "lower", label: "Au moins une lettre minuscule (a-z)", ok: /[a-z]/.test(v) },
    { key: "special", label: `Au moins un caractère spécial (${SPECIAL_CHARS})`, ok: specials >= 1 },
    { key: "specialMax", label: "Pas plus de 2 caractères spéciaux", ok: specials <= 2 },
  ];
}

export function validatePassword(pwd: string): string | null {
  const v = pwd ?? "";
  if (v.length < 8) return "Le mot de passe doit contenir au minimum 8 caractères.";
  if (!/[A-Z]/.test(v)) return "Le mot de passe doit contenir au moins une lettre majuscule.";
  if (!/[a-z]/.test(v)) return "Le mot de passe doit contenir au moins une lettre minuscule.";
  const specials = (v.match(SPECIAL_REGEX) ?? []).length;
  if (specials < 1) return "Le mot de passe doit contenir au moins un caractère spécial.";
  if (specials > 2) return "Le mot de passe ne peut pas contenir plus de 2 caractères spéciaux.";
  return null;
}

export function isPasswordValid(pwd: string): boolean {
  return validatePassword(pwd) === null;
}

function pick(set: string): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return set[arr[0] % set.length];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const r = new Uint32Array(1);
    crypto.getRandomValues(r);
    const j = r[0] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateStrongPassword(length = 10): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const len = Math.max(8, length);
  // Decide number of specials: 1 or 2
  const r = new Uint32Array(1);
  crypto.getRandomValues(r);
  const specialCount = (r[0] % 2) + 1;

  const chars: string[] = [];
  chars.push(pick(upper));
  chars.push(pick(lower));
  for (let i = 0; i < specialCount; i++) chars.push(pick(SPECIAL_CHARS));

  const nonSpecial = upper + lower + digits;
  while (chars.length < len) chars.push(pick(nonSpecial));

  return shuffle(chars).join("");
}
