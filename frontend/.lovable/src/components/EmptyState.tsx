import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export function EmptyState({ message = "Aucune donnée disponible" }: { message?: string }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1} p={4} color="text.secondary">
      <InboxIcon fontSize="large" />
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
}