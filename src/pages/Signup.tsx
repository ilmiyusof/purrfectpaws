import { Avatar, Box, Button, Card, Grid, Link, TextField } from "@mui/material";
import Container from "@mui/material/Container";
import logo from '../assets/logo.jpg';
import { useState } from "react";
import { signUp } from "../service/api";
import { validateConfirmPassword, validateEmailPattern, validateNamePattern, validatePasswordPattern } from "../common/commonFunctions";
import SignUpSuccess from "../dialog/signUpSuccess";
import { NumericFormat } from 'react-number-format';
import React from "react";
import SignUpFail from "../dialog/signUpFail";

export default function Signup() {

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showFailDialog, setShowFailDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        streetAddr1: '',
        streetAddr2: '',
        poscode: '',
        state: '',
        city: '',
        country: ''
    })

    const [formErrors, setFormErrors] = useState({
        nameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
        streetAddr1Error: '',
        poscodeError: '',
        cityError: '',
        countryError: ''
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = () => {
        event?.preventDefault()
        const errors = {
            nameError: '',
            emailError: '',
            passwordError: '',
            confirmPasswordError: '',
            streetAddr1Error: '',
            poscodeError: '',
            cityError: '',
            countryError: ''
        };
        if (formData.name.trim() === '') {
            errors.nameError = 'Name cannot be empty.'
        } else if (!validateNamePattern(formData.name)) {
            errors.nameError = 'Invalid name format.'
        } else {
            errors.nameError = ''
        }

        if (formData.email.trim() === '') {
            errors.emailError = 'Email cannot be empty.'
        } else if (!validateEmailPattern(formData.email)) {
            errors.emailError = 'Invalid email format.'
        } else {
            errors.emailError = ''
        }

        if (formData.password.trim() === '') {
            errors.passwordError = 'Password cannot be empty.'
        } else if (!validatePasswordPattern(formData.password)) {
            errors.passwordError = 'Password should contain atleast 8 characters, uppercase, lowercase and 1 special character'
        } else {
            errors.passwordError = ''
        }

        if (formData.confirmPassword.trim() === '') {
            errors.confirmPasswordError = 'Password cannot be empty.'
        } else if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
            errors.confirmPasswordError = 'Password should be same as above.'
        } else {
            errors.confirmPasswordError = ''
        }

        if (formData.streetAddr1.trim() === '') {
            errors.streetAddr1Error = 'Street address cannot be empty.'
        } else {
            errors.streetAddr1Error = ''
        }

        if (formData.poscode.trim() === '') {
            errors.poscodeError = 'Postcode cannot be empty.'
        } else {
            errors.poscodeError = ''
        }

        if (formData.city.trim() === '') {
            errors.cityError = 'City cannot be empty.'
        } else if (!validateNamePattern(formData.city)) {
            errors.cityError = 'Invalid city.'
        } else {
            errors.cityError = ''
        }

        if (formData.country.trim() === '') {
            errors.countryError = 'Country cannot be empty.'
        } else if (!validateNamePattern(formData.country)) {
            errors.countryError = 'Invalid country.'
        } else {
            errors.countryError = ''
        }

        const noErrors =
            errors.nameError !== '' || errors.emailError !== '' || errors.cityError !== '' || errors.passwordError !== ''
            || errors.streetAddr1Error !== '' || errors.poscodeError !== '' || errors.countryError !== ''

        if (!noErrors) {
            console.log(formData, "form")
            signUp(formData)
                .then((response) => {
                    console.log(response, "reponse")
                    setShowSuccessDialog(true);
                }).catch((error: any) => {
                    setFormErrors(errors);
                    console.log(error, "error")

                    if (error?.response?.status === 409) {
                        console.log("ere")
                        setShowFailDialog(true);
                    }

                })
        } else {
            console.log("eror", errors)
            setFormErrors(errors);
        }
    };

    const onClickSignIn = (url: string) => {
        window.location.href = url;
    }
    console.log(showSuccessDialog, "dialog")
    return (
        <>  {showSuccessDialog && <SignUpSuccess />}
            {showFailDialog && <SignUpFail />}
            <Container sx={{ maxWidth: 500 }}>
                <Card sx={{ maxWidth: 600 }}>
                    <Avatar src={logo} sx={{ width: 175, height: 155, ml: '220px', mt: '2px' }} />
                    <Box sx={{ display: 'inline-block' }}>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mx: '8px', mb: "8px" }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="name"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        autoFocus
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.name}
                                        error={Boolean(formErrors.nameError)}
                                        helperText={formErrors.nameError} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.email}
                                        error={Boolean(formErrors.emailError)}
                                        helperText={formErrors.emailError} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.password}
                                        error={Boolean(formErrors.passwordError)}
                                        helperText={formErrors.passwordError} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
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
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="street-addr1"
                                        name="streetAddr1"
                                        required
                                        fullWidth
                                        id="streetAddr1"
                                        label="Street Address 1"
                                        autoFocus
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.streetAddr1}
                                        error={Boolean(formErrors.streetAddr1Error)}
                                        helperText={formErrors.streetAddr1Error} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="street-addr2"
                                        name="streetAddr2"
                                        fullWidth
                                        id="streetAddr2"
                                        label="Street Address 2"
                                        autoFocus
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.streetAddr2} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <NumericFormat
                                        customInput={TextField}
                                        autoComplete="poscode"
                                        name="poscode"
                                        required
                                        fullWidth
                                        id="poscode"
                                        label="Postcode"
                                        autoFocus
                                        size="small"
                                        onChange={handleChange}
                                        error={Boolean(formErrors.poscodeError)}
                                        helperText={formErrors.poscodeError}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="state"
                                        name="state"
                                        fullWidth
                                        id="state"
                                        label="State"
                                        autoFocus
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.state} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="city"
                                        name="city"
                                        required
                                        fullWidth
                                        id="city"
                                        label="City"
                                        autoFocus
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.city}
                                        error={Boolean(formErrors.cityError)}
                                        helperText={formErrors.cityError} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="country"
                                        name="country"
                                        required
                                        fullWidth
                                        id="country"
                                        label="Country"
                                        autoFocus
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.country}
                                        error={Boolean(formErrors.countryError)}
                                        helperText={formErrors.countryError} />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 1, mb: 2, backgroundColor:"#ceebfa" }}
                                size="small"
                                onClick={handleSubmit}
                            >
                                Sign Up
                            </Button>
                            <Grid item>
                                <Link href="#" variant="body2" onClick={() => onClickSignIn('/')}>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Box>
                    </Box>
                </Card>
            </Container>
        </>
    );

}