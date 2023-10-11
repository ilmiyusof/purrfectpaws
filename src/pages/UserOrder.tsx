import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Container, Stack, Typography } from '@mui/material';
import HeaderBar from '../header/header.tsx';
import '../css/home.css';
import { useEffect, useState } from 'react';
import { userOrder } from '../service/api.tsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function UserOrder() {
  const [order, setOrder] = useState<any>([]);
  //const src = "https://www.chelseacats.co.uk/wp-content/uploads/2017/03/Cheahire-Wain-navy-blue-luxury-leather-cat-collar.jpg";
  useEffect(() => {
    // Make an asynchronous request to fetch data
    async function fetchData() {
      try {
        userOrder(sessionStorage.getItem('userId'))
          .then((response) => {
            console.log(response, "reponse")
            setOrder(response?.data)
          }).catch((error: Error) => {
            console.log(error, "error")
          })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData(); // Call the fetchData function when the component mounts

  }, []);

  console.log(order, "Asdsad")
  return (
    <><Container>
      <div className='navBar'>
        <HeaderBar />
      </div>

    </Container>
      <br />
      <Container maxWidth="md" sx={{ marginTop: "50px" }}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Your Order History
        </Typography>
        <br />
        {order.map((order: any) => (
          <><Card sx={{ bgcolor: "#ceebfa", borderRadius: 3 }}>
            <Stack direction="row" spacing={2}>
              {/* <Box component="img" src={src} sx={{ width: 150, height: 100, borderRadius: 1.5, flexShrink: 0 }} p={2} /> */}
              <Box sx={{ minWidth: 500, textAlign: "left" }} p={2}>
                <Typography variant="h5" noWrap>
                  {order?.productOrderDetailsDTO?.productDetails?.productName}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }} noWrap>
                  Order ID : {order?.orderId}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }} noWrap>
                  Variation : {order?.productOrderDetailsDTO?.product?.leadLength !== null ? `${order?.productOrderDetailsDTO?.product?.variation?.variationName}, ${order?.productOrderDetailsDTO?.product?.leadLength} cm` : `${order?.productOrderDetailsDTO?.product?.size?.sizeLabel}, ${order?.productOrderDetailsDTO?.product?.variation?.variationName}`}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }} noWrap>
                  Quantity : {order?.quantity}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ flexShrink: 0, color: "#ff6500" }} p={2}>
                {order?.orderStatus?.status}
              </Typography>
            </Stack>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1" sx={{ pr: 2, color: 'text.secondary'}} noWrap>
                {`RM ${parseFloat(order?.productOrderDetailsDTO?.productDetails?.productPrice).toFixed(2)} x ${order?.quantity}`}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" sx={{ pr: 2, color: 'text.secondary' }} noWrap>
                RM {parseFloat(order?.totalPrice).toFixed(2)}
              </Typography>
            </Box>
            <Accordion sx={{ bgcolor: "#ceebfa", borderRadius: 3, width: 680, }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>More Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography textAlign={"left"}>
                  Address : {`${order?.shippingAddress?.street1}, ${order?.billingAddress?.street2}, ${order?.billingAddress?.street1},${order?.billingAddress?.postcode},
                          ${order?.billingAddress?.city}, ${order?.billingAddress?.state}, ${order?.billingAddress?.country}`}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Card><br /></>
        ))
        }
      </Container>
    </>
  );

}
