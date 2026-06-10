import { Box, CircularProgress, Typography } from "@mui/material";

export function LoadingSpinner({ label = "Chargement..." }: { label?: string }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={4}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Box>
  );
}