import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Container, Divider, Grid, TextField, Typography } from '@mui/material';
import HeaderBar from '../header/header.tsx';
import '../css/home.css';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { validateNamePattern } from '../common/commonFunctions.tsx';
import { getUserProfile, updateDetails } from '../service/api.tsx';
import ChangePassword from '../dialog/changePassword.tsx';

export default function UserProfile() {

  const [showChangePwDialog, setShowChangePwDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    streetAddr1: '',
    streetAddr2: '',
    poscode: '',
    state: '',
    city: '',
    country: ''
  })

  const [formErrors, setFormErrors] = useState({
    streetAddr1Error: '',
    poscodeError: '',
    cityError: '',
    countryError: ''
  })

  useEffect(() => {
    // Make an asynchronous request to fetch data
    async function fetchData() {
      try {
        getUserProfile(sessionStorage.getItem('userId'))
          .then((response) => {
            console.log(response, "reponse")
            setFormData({
              ...formData,
              name: response?.data?.name,
              email: response?.data?.email,
              streetAddr1: response?.data?.shippingAddress[0]?.street1,
              streetAddr2: response?.data?.shippingAddress[0]?.street2 ? response?.data?.shippingAddress[0]?.street1 : "",
              poscode: response?.data?.shippingAddress[0]?.postcode,
              state: response?.data?.shippingAddress[0]?.state ? response?.data?.shippingAddress[0]?.state : response?.data?.shippingAddress[0]?.state,
              city: response?.data?.shippingAddress[0]?.city,
              country: response?.data?.shippingAddress[0]?.country ? response?.data?.shippingAddress[0]?.country : response?.data?.shippingAddress[0]?.country
            })
          }).catch((error: Error) => {
            console.log(error, "error")
          })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  console.log(formData, "sdsade")

  const handleSubmit = () => {
    event?.preventDefault()
    const errors = {
      streetAddr1Error: '',
      poscodeError: '',
      cityError: '',
      countryError: ''
    };

    if (formData.streetAddr1.trim() === '') {
      errors.streetAddr1Error = 'Street address cannot be empty.'
    } else {
      errors.streetAddr1Error = ''
    }

    if (formData?.poscode === '') {
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
      errors.cityError !== '' || errors.streetAddr1Error !== '' || errors.poscodeError !== ''

    if (!noErrors) {
      console.log(formData, "form")
      updateDetails(formData, sessionStorage.getItem('userId'))
        .then((response) => {
          console.log(response, "reponse")
          setFormData({
            name: response?.data?.name,
            email: response?.data?.email,
            streetAddr1: response?.data?.shippingAddress[0]?.street1,
            streetAddr2: response?.data?.shippingAddress[0]?.street2 ? response?.data?.shippingAddress[0]?.street1 : "",
            poscode: response?.data?.shippingAddress[0]?.postcode,
            state: response?.data?.shippingAddress[0]?.state ? response?.data?.shippingAddress[0]?.state : response?.data?.shippingAddress[0]?.state,
            city: response?.data?.shippingAddress[0]?.city,
            country: response?.data?.shippingAddress[0]?.country
          })
          setSuccessMessage('User profile successfully updated.')
        }).catch((error: any) => {
          setFormErrors(errors);
          console.log(error, "error")

        })
    } else {
      console.log("eror", errors)
      setFormErrors(errors);
    }
  };

  function stringAvatar(name: string) {
    return {
      children: name ? `${name?.split(' ')[0][0]}` : `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  function toTitleCase(str: any) {
    const titleCase = str
      ?.toLowerCase()
      .split(' ')
      .map((word: any) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');

    return titleCase;
  }


  return (
    <>
      {showChangePwDialog && <ChangePassword onClose={() => setShowChangePwDialog(false)} />}
      <Container>
        <div className='navBar'>
          <HeaderBar />
        </div>
        {formData?.name ? (
          <Box sx={{ alignItems: "center", display: 'flex', flexDirection: 'column'}} >
            <Grid container spacing={1} >
              <Grid xs={12} md={4} ml={10} mr={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }} >
                      <Avatar {...stringAvatar(toTitleCase(formData?.name))} sx={{ height: 70, mb: 2, width: 70, textAlign: "center", position:"inherit" }} />
                      <Typography gutterBottom variant="h5"  >
                        {toTitleCase(formData?.name)}
                      </Typography>
                      <Typography color="text.secondary" variant="body2" >
                        {toTitleCase(formData.city)}
                        {/* {toTitleCase(formData?.country)} */}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {formData.email}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                </Card>
              </Grid>
              <br />
              <Grid xs={12} md={6}>
                <form autoComplete="off" noValidate>
                  <Card sx={{ maxWidth: 1000 }}>
                    <CardHeader title="Profile" />
                    <CardContent sx={{ p: 1, m: 1}}>
                      <Box >
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6} >
                            <TextField
                              autoComplete="given-name"
                              name="name"
                              required
                              fullWidth
                              id="name"
                              label="Name"
                              autoFocus
                              size="small"
                              disabled
                              value={toTitleCase(formData.name)} />
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
                              disabled
                              onChange={handleChange}
                              value={formData.email} />
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
                              helperText={formErrors.streetAddr1Error}
                            />
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
                              value={formData.poscode}
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
                              helperText={formErrors.cityError}
                            />
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
                          helperText={formErrors.countryError}
                        />
                          </Grid>
                        </Grid>
                        {successMessage && <div style={{ color: 'green', textAlign:'center' }}>{successMessage}</div>}
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button variant="outlined" onClick={() => setShowChangePwDialog(true)} sx={{ backgroundColor: "#ceebfa" }}>
                        Change Password
                      </Button>
                      <Button variant="outlined" onClick={handleSubmit} sx={{ backgroundColor: "#ceebfa" }}>
                        Save details
                      </Button>
                    </CardActions>
                  </Card>
                </form>
              </Grid>
            </Grid>
          </Box>
        ) : ""}
      </Container></>
  );

}