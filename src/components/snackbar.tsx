import { Snackbar } from '@mui/material';

interface snackbarProps {
    open: boolean;
    message: string;
    close: () => void;
}

function ShowSnackBar({ open, message, close }: snackbarProps) {
    return (
        <Snackbar
            open={open}
            message={message}
            autoHideDuration={4000}
            onClose={close}
        />
    );
}

export default ShowSnackBar;
