/* eslint-disable no-unsafe-optional-chaining */
import { Button, Card, CardActions, CardContent, CardMedia, Container, Divider, Grid, Typography } from '@mui/material';
import HeaderBar from '../header/header.tsx';
import '../css/home.css';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Home() {

  const navigate = useNavigate();
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    // Make an asynchronous request to fetch data
    async function fetchData() {
      try {
        const response = await axios.get('https://purrfectpawsshopapi.azurewebsites.net/api/TProducts');
        setProducts(response.data); // Update the state with the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData(); // Call the fetchData function when the component mounts
  }, []);


  const rdmsrc = [
    "https://storagepurrfectpaws.blob.core.windows.net/storagecontainerpurrfectpaws/eb426865-d9ac-4b14-90f7-a5810486da9e.png",
    "https://i.pinimg.com/736x/3c/c4/40/3cc440914d1dc5c14f890e307020f15a--fancy-dog-collars-shirt-collars.jpg",
    "https://www.pettag4life.ca/506-thickbox_default/cat-harness.jpg",
    "https://th.bing.com/th/id/OIP.yslLIQR2IuGxpd1y8eM5SQHaHa?pid=ImgDet&rs=1"
  ];

  const onClickView = (id: number) => {
    navigate(`/productDetail/${id}`)
  }

  return (
    <>
      <Container>
        <div className='navBar'>
          <HeaderBar />
        </div>
        {/* <div style={{ marginLeft: -190, width: 60, display: "flex", height: 478.5, flexDirection: "row" }}>
        <img src={banner} />
        </div> */}
        <Container maxWidth="md" sx={{ marginTop: "70px" }}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Welcome to PurrfectPaws !
          </Typography>
        </Container>
        <Container maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {products.map((product:any) => (

              <Grid item key={product.productDetailsId} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '65%'
                    }}
                    image={product.productImages[0]?.blobImageUrl || rdmsrc[0]}
                  />
                  <Divider></Divider>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h4" component="h2">
                      {product?.productName}
                    </Typography>
                    <Typography>
                      RM {(product?.productPrice).toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => onClickView(product.productDetailsId)}>View</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
    </>

  );

}
