import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Avatar, Box } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteSuccessAdmin() {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    const handleYes = () => {
        //api call
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ width: 70, height: 70, m: 4 }} variant="square">
                        <DeleteForeverIcon sx={{ fontSize: 80 }} color='error' />
                    </Avatar></Box>
                <DialogTitle>{"Are you sure you want to delete the item?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleYes} color='success'>Yes</Button>
                    <Button onClick={handleClose} color='error'>No</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}