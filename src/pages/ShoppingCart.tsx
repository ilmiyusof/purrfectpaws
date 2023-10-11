import { Box, Button, Card, Container, Grid, IconButton, Link, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HeaderBar from '../header/header.tsx';
import '../css/cart.css';
import { useEffect, useState } from 'react';
import { deleteCartItem, getCart, proceedOrder, updateItemQuantity, updateShippingAddress } from '../service/api.tsx';
import PaymentFail from '../dialog/paymentFailed.tsx';
import PaymentSuccess from '../dialog/paymentSuccess.tsx';


export default function ShoppingCart() {

  const [formData, setFormData] = useState({
    name: '',
    streetAddr1: '',
    streetAddr2: '',
    postCode: '',
    state: '',
    city: '',
    country: '',
    cardNo: '',
    expiryDate: '',
    cvv: '',
  });

  const [formErrors, setFormErrors] = useState({
    nameError: '',
    streetAddr1Error: '',
    postCodeError: '',
    stateError: '',
    cityError: '',
    countryError: '',
    cardNoError: '',
    expiryDateError: '',
    cvvError: '',
  });


  const [cartItems, setCartItems] = useState<any>([]);
  const [paymentSucessDialog, showPaymentSuccessDialog] = useState(false);
  const [paymentFailedDialog] = useState(false);




  let total = 0.00;


  useEffect(() => {
    // Make an asynchronous request to fetch data
    async function fetchData() {
      try {
        getCart(sessionStorage.getItem('userId'))
          .then((response) => {
            console.log(response, "response")
            setCartItems(response?.data?.productDetails);
            setFormData({
              ...formData,
              name: response?.data?.userName,
              streetAddr1: response?.data?.userShippingAddress?.street1,
              streetAddr2: response?.data?.userShippingAddress?.street2 ? response?.data?.userShippingAddress?.street1 : "",
              postCode: response?.data?.userShippingAddress?.postcode.toString(),
              state: response?.data?.userShippingAddress?.state ? response?.data?.userShippingAddress?.state : response?.data?.userShippingAddress?.state,
              city: response?.data?.userShippingAddress?.city,
              country: response?.data?.userShippingAddress?.country ? response?.data?.userShippingAddress?.country : response?.data?.userShippingAddress?.country
            })
          }).catch((errorCart: Error) => {
            console.log(errorCart, "errorCart")
          })
      } catch (errorCart) {
        console.error("Error fetching cart data:", errorCart);
      }
    }
    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  const validateNamePattern = (name: string) => {
    const nameRegex = /^[A-Za-z][A-Za-z\s]*$/;
    return nameRegex.test(name);
  }

  const validateCVVPattern = (name: string) => {
    const numRegex = /^\d*$/;
    if (name.length !== 3) {
      return false;
    }
    return numRegex.test(name);
  }

  const validateCardNumberPattern = (name: string) => {
    const visaPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    const mastPattern = /^(?:5[1-5][0-9]{14})$/;
    if (name.startsWith('5')) {
      return mastPattern.test(name)
    } else if (name.startsWith('4')) {
      return visaPattern.test(name)
    } else {
      return false;
    }
  }

  const validateExpiryDatePattern = (name: string) => {
    const expiryDatePattern = /^((0[1-9])|(1[0-2]))\/?((20)\d{2}|(19)\d{2})$/;
    return expiryDatePattern.test(name)
  }

  // Function to submit the order
  const handleSubmitOrder = (cartItems: any) => {
    // Handle order submission logic here (e.g., sending data to a server)
    // First, do some checking...
    const errors = {
      nameError: '',
      streetAddr1Error: '',
      postCodeError: '',
      stateError: '',
      cityError: '',
      countryError: '',
      cardNoError: '',
      expiryDateError: '',
      cvvError: '',
      quantityError: ''
    };
    if (formData.name.trim() === '') {
      errors.nameError = 'Name cannot be empty.'
    } else if (!validateNamePattern(formData.name)) {
      errors.nameError = 'Invalid name format.'
    } else {
      errors.nameError = ''
    }

    if (formData.streetAddr1.trim() === '') {
      errors.streetAddr1Error = 'Street address cannot be empty.'
    } else {
      errors.streetAddr1Error = ''
    }

    if (formData.postCode.trim() === '') {
      errors.postCodeError = 'Post Code cannot be empty.'
    } else {
      errors.postCodeError = ''
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

    if (formData.cardNo.trim() === '') {
      errors.cardNoError = 'Card Number cannot be empty.'
    } else if (!validateCardNumberPattern(formData.cardNo)) {
      errors.cardNoError = 'Invalid Card Number.'
    } else {
      errors.cardNoError = ''
    }

    if (formData.expiryDate.trim() === '') {
      errors.expiryDateError = 'Expiry Date cannot be empty.'
    } else if (!validateExpiryDatePattern(formData.expiryDate)) {
      errors.expiryDateError = 'Invalid Expiry Date.'
    } else {
      errors.expiryDateError = ''
    }

    if (formData.cvv.trim() === '') {
      errors.cvvError = 'CVV cannot be empty.'
    } else if (!validateCVVPattern(formData.cvv)) {
      errors.cvvError = 'Invalid CVV.'
    } else {
      errors.cvvError = ''
    }

    const noErrors =
      errors.nameError !== '' || errors.cityError !== '' || errors.streetAddr1Error !== '' || errors.postCodeError !== '' || errors.countryError !== '' || errors.quantityError !== '' || errors.cardNoError !== '' || errors.expiryDateError !== '' || errors.cvvError !== ''
    if (!noErrors) {
      console.log(formData, "form")
      {/*Process API Update */ }
      updateShippingAddress(formData, sessionStorage.getItem('userId'));
      proceedOrder(sessionStorage.getItem('userId'), getTotal()+5, cartItems?.shippingAdddressId, cartItems?.shippingAdddressId)
      showPaymentSuccessDialog(true);
    } else {
      console.log("error", errors)
      setFormErrors(errors);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  const calculateTotal = (event: number) => {
    let value = event;
    total += value;
    return total;
  }

  const getTotal = () => {
    return total;
  }

  const removeCartItem = (productId: any) => {
    var choice = window.confirm("Are you sure you want to delete")
    if(choice) {
      deleteCartItem(productId);
      window.location.reload();
    } else {
      close();
    }
  }

  const updateCartItemQuantity = (cartId: any, quantity: any) => {
    updateItemQuantity(cartId, quantity)
    window.location.reload();
  }

  const goHome = () => {
    window.location.href = '/';
  }

  return (
    <Container>
    {paymentSucessDialog && <PaymentSuccess />}
    {paymentFailedDialog && <PaymentFail />}
      <div className='navBar'>
        <HeaderBar />
      </div>
      <div className="checkout-container">
        {/* Display the list of items in the cart */}
        <div className="cart">
          <h1>Checkout - Cart</h1>
          <Container>
            {cartItems.map((cartItems: any) => (
              <Card sx={{ bgcolor: "#ceebfa", borderRadius: 3 }}>
                <Stack direction="row" spacing={2}>
                  <Box sx={{ minWidth: 500, textAlign: "left" }} p={2}>
                    <Typography variant="h5" noWrap>
                      {cartItems?.productName}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', height: '30px' }} noWrap>
                      Variation : {cartItems?.productLength !== 0 ? `${cartItems?.productVariation}, ${cartItems?.productLength} cm` : `${cartItems?.productSize}, ${cartItems?.productVariation}`}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', height: '50px' }}>
                      <TextField label="Quantity" name={cartItems?.cartId} defaultValue={cartItems?.cartQuantity} style={{ width: '90px', height: '150px' }} variant='outlined' size='small' onBlur={(event) => updateCartItemQuantity(cartItems?.cartId, event.target.value)}></TextField>
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ flexShrink: 0, color: "#ff6500" }} p={2}>
                    <IconButton size='small' onClick={() => removeCartItem(cartItems?.productId)}> <DeleteIcon /></IconButton>
                  </Typography>
                </Stack>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body1" sx={{ pr: 2, color: 'text.secondary' }} noWrap>
                    {`RM ${parseFloat(cartItems?.productPrice).toFixed(2)} x ${cartItems?.cartQuantity}`}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ pr: 2, color: 'text.secondary' }} noWrap>
                    RM {(parseFloat(cartItems?.productPrice) * parseFloat(cartItems?.cartQuantity)).toFixed(2)}
                    <div style={{ display: 'none' }}>{calculateTotal(parseFloat(cartItems?.productPrice) * parseFloat(cartItems?.cartQuantity))}</div>
                  </Typography>
                </Box>
              </Card>
            ))}
          </Container>
        </div>
        <div className='bill'>
          <h2 style={{ textAlign: 'left' }}>Subtotal:</h2>
          <Typography variant="h6" sx={{ pr: 2, color: 'text.secondary', textAlign: 'right' }} noWrap>
            RM {getTotal().toFixed(2)}
          </Typography>
          <h2 style={{ textAlign: 'left' }}>Shipping Fee:</h2>
          <Typography variant="h6" sx={{ pr: 2, color: 'text.secondary', textAlign: 'right' }} noWrap>
            RM 5.00
          </Typography>
          <h2 style={{ textAlign: 'left' }}>Grand Total:</h2>
          <Typography variant="h6" sx={{ pr: 2, color: 'text.secondary', textAlign: 'right' }} noWrap>
            RM {(getTotal() + 5).toFixed(2)}
          </Typography>
        </div>
        {/* Shipping Address Form */}
        <div className="shipping-form">
          <h1>Shipping Address</h1>
          <form>
            <div className="form-group">
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
              <br />
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
              <br />
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
              <br />
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="post-code"
                  name="postCode"
                  required
                  fullWidth
                  id="postCode"
                  label="Post Code"
                  autoFocus
                  size="small"
                  onChange={handleChange}
                  value={formData.postCode}
                  error={Boolean(formErrors.postCodeError)}
                  helperText={formErrors.postCodeError} />
              </Grid>
              <br />
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
                  value={formData.state}
                  error={Boolean(formErrors.stateError)}
                  helperText={formErrors.stateError} />
              </Grid>
              <br />
              <Grid item xs={12}>
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
              <br />
              <Grid item xs={12}>
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
            </div>
          </form>
          <Link href="#" variant="body2" onClick={() => goHome()}>
            Not done shopping? Click Here
          </Link>
        </div>

        {/* Payment Information Form */}
        <div className="payment-form">
          <h1>Payment Information</h1>
          <form>
            <div className="form-group2">
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="card-no"
                  name="cardNo"
                  required
                  fullWidth
                  id="cardNo"
                  label="Card Number"
                  autoFocus
                  size="small"
                  onChange={handleChange}
                  value={formData.cardNo}
                  error={Boolean(formErrors.cardNoError)}
                  helperText={formErrors.cardNoError} />
              </Grid>
              <br />
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="expiry-date"
                  name="expiryDate"
                  required
                  fullWidth
                  id="expiryDate"
                  label="Expiry Date (mm/yyyy)"
                  autoFocus
                  size="small"
                  onChange={handleChange}
                  value={formData.expiryDate}
                  error={Boolean(formErrors.expiryDateError)}
                  helperText={formErrors.expiryDateError} />
              </Grid>
              <br />
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="cvv"
                  name="cvv"
                  required
                  fullWidth
                  id="cvv"
                  label="CVV/CVC"
                  autoFocus
                  size="small"
                  onChange={handleChange}
                  value={formData.cvv}
                  error={Boolean(formErrors.cvvError)}
                  helperText={formErrors.cvvError} />
              </Grid>
            </div>
          </form>
        </div>
      </div>
      {/* Button to submit the order */}
      <br />
      <Button type="submit"
        fullWidth
        variant="outlined"
        sx={{ backgroundColor: "#ceebfa" }}
        size="small" onClick={() => handleSubmitOrder(cartItems)}>Submit Order</Button>
    </Container>
  );
}
