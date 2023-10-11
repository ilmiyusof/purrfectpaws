import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Grid, TextField } from '@mui/material';
import { DialogContent } from '@mui/material';
import { useState } from 'react';
import { validateConfirmPassword, validatePasswordPattern } from '../common/commonFunctions';
import { updatePassword } from '../service/api';

interface ChangePasswordProps {
    onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChangePassword({onClose}:ChangePasswordProps) {

    const [open, setOpen] = React.useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [formErrors, setFormErrors] = useState({
        oldPasswordError: '',
        newPasswordError: '',
        confirmPasswordError: '',
    })

    function handleUpdate() {
        event?.preventDefault();
        const errors = {
            oldPasswordError: '',
            newPasswordError: '',
            confirmPasswordError: '',
        }

        if (formData.oldPassword.trim() === '') {
            errors.oldPasswordError = 'Field cannot be empty.'
        }  else {
            errors.oldPasswordError = ''
        }

        if (formData.newPassword.trim() === '') {
            errors.newPasswordError = 'Field cannot be empty.'
        } else if (!validatePasswordPattern(formData.newPassword)) {
            errors.newPasswordError = 'Password should contain atleast 8 characters, uppercase, lowercase and 1 special character'
        } else {
            errors.newPasswordError = ''
        }

        if (formData.confirmPassword.trim() === '') {
            errors.confirmPasswordError = 'Field cannot be empty.'
        } else if (!validateConfirmPassword(formData.newPassword, formData.confirmPassword)) {
            errors.confirmPasswordError = 'Password should be same as new password.'
        } else {
            errors.confirmPasswordError = ''
        }

        const noErrors =
            errors.oldPasswordError !== '' || errors.newPasswordError !== '' || errors.confirmPasswordError !== ''

        if (!noErrors) {
            console.log(formData, "form")
            updatePassword(formData.oldPassword, formData.newPassword, sessionStorage.getItem('userId'))
                .then((response) => {
                    console.log(response, "reponse")
                    setErrorMessage("")
                    setSuccessMessage("Password updated successfully.")
                    setSuccess(true)
                }).catch((error: any) => {
                    setFormErrors(errors);
                    console.log(error, "error")
                    if (error?.response?.status === 400) {
                        console.log("ere")
                        setSuccessMessage("")
                        setErrorMessage('Incorrect old password')
                    }
                })
        } else {
            console.log("eror", errors)
            setFormErrors(errors);
        }
    }

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Change Password."}</DialogTitle>
                <DialogContent>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            sx={{width:"500px"}}
                            name="oldPassword"
                            label="Old Password"
                            type="password"
                            id="oldPassword"
                            autoComplete="new-password"
                            size="small"
                            onChange={handleChange}
                            value={formData.oldPassword}
                            error={Boolean(formErrors.oldPasswordError)}
                            helperText={formErrors.oldPasswordError} />
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            sx={{width:"500px"}}
                            name="newPassword"
                            label="New Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            size="small"
                            onChange={handleChange}
                            value={formData.newPassword}
                            error={Boolean(formErrors.newPasswordError)}
                            helperText={formErrors.newPasswordError} />
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            sx={{width:"500px"}}
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            size="small"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={Boolean(formErrors.confirmPasswordError)}
                            helperText={formErrors.confirmPasswordError} />
                    </Grid>
                    {errorMessage && <div style={{ color: 'red', textAlign:'center' }}>{errorMessage}</div>}
                    {successMessage && <div style={{ color: 'green', textAlign:'center' }}>{successMessage}</div>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpdate}>Update</Button>
                    {!success && <Button onClick={onClose}>Cancel</Button>}
                    {success && <Button onClick={onClose}>Ok</Button>}
                </DialogActions>
            </Dialog>
        </div>
    );
}