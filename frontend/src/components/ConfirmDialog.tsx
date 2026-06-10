import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { LoadingButton } from "@/components/LoadingButton";

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open, title = "Confirmation", message,
  confirmLabel = "Confirmer", cancelLabel = "Annuler",
  onConfirm, onCancel, loading,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
        <LoadingButton onClick={onConfirm} variant="contained" color="primary" loading={loading}>
          {confirmLabel}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}