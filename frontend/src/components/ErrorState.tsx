import { Alert, Button, Stack } from "@mui/material";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Stack spacing={2} alignItems="flex-start" p={2}>
      <Alert severity="error" sx={{ width: "100%" }}>{message}</Alert>
      {onRetry && <Button onClick={onRetry} variant="outlined">Réessayer</Button>}
    </Stack>
  );
}