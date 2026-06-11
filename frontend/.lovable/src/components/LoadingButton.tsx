import { forwardRef, useEffect, useRef, useState, type MouseEvent } from "react";
import { Button, type ButtonProps, CircularProgress, Box } from "@mui/material";

export interface LoadingButtonProps extends Omit<ButtonProps, "onClick"> {
  /** External loading flag (e.g. coming from Redux). Combined with internal busy state. */
  loading?: boolean;
  /** Label shown while idle (falls back to children). */
  idleLabel?: React.ReactNode;
  /** Label shown during processing. */
  loadingLabel?: string;
  /** Threshold (seconds) after which a "still processing" hint is shown. */
  longRunningAfter?: number;
  /** Click handler — may be sync or async. The button stays disabled until the promise settles. */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Centralized action button:
 *  - Disables itself the moment it's clicked (prevents double-submit).
 *  - Shows a spinner + "Traitement en cours..." + elapsed timer.
 *  - After `longRunningAfter` seconds, shows a "please wait" hint.
 *  - Re-enables automatically when the click handler resolves/rejects.
 */
export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(function LoadingButton(
  {
    loading: externalLoading = false,
    idleLabel,
    loadingLabel = "Traitement en cours...",
    longRunningAfter = 5,
    onClick,
    children,
    disabled,
    type = "button",
    sx,
    ...rest
  },
  ref,
) {
  const [internalBusy, setInternalBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const mounted = useRef(true);
  const busyRef = useRef(false);

  useEffect(() => () => { mounted.current = false; }, []);

  const busy = externalLoading || internalBusy;

  useEffect(() => { busyRef.current = busy; }, [busy]);

  // Timer lifecycle: start when busy, reset/stop when idle.
  useEffect(() => {
    if (!busy) {
      startRef.current = null;
      setElapsed(0);
      return;
    }
    startRef.current = Date.now();
    setElapsed(0);
    const id = window.setInterval(() => {
      if (startRef.current != null) {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [busy]);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (busyRef.current || disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!onClick) return;
    busyRef.current = true;
    setInternalBusy(true);
    try {
      const result = onClick(e);
      if (result && typeof (result as Promise<unknown>).then === "function") {
        await result;
      }
    } catch {
      // L'erreur est gérée par le flux appelant ; le loader doit toujours s'arrêter.
    } finally {
      busyRef.current = false;
      if (mounted.current) setInternalBusy(false);
    }
  };

  const showLong = busy && elapsed >= longRunningAfter;

  return (
    <Button
      ref={ref}
      type={type}
      onClick={handleClick}
      disabled={busy || disabled}
      sx={{
        position: "relative",
        transition: "all .15s ease",
        ...(busy && {
          cursor: "not-allowed !important",
          opacity: 0.75,
          filter: "grayscale(0.3)",
        }),
        ...sx,
      }}
      {...rest}
    >
      {busy ? (
        <Box
          component="span"
          sx={{ display: "inline-flex", alignItems: "center", gap: 1, animation: "fade-in .2s ease-out" }}
        >
          <CircularProgress size={16} thickness={5} color="inherit" />
          <span>{loadingLabel}</span>
          <span style={{ fontVariantNumeric: "tabular-nums", opacity: 0.85 }}>{fmt(elapsed)}</span>
          {showLong && (
            <span style={{ marginLeft: 6, fontSize: "0.75em", opacity: 0.85, fontStyle: "italic" }}>
              Veuillez patienter, le traitement est toujours en cours...
            </span>
          )}
        </Box>
      ) : (
        idleLabel ?? children
      )}
    </Button>
  );
});

export default LoadingButton;