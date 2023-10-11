/* eslint-disable no-unsafe-optional-chaining */
import { Box, Button, Card, CardActions, CardContent, CardMedia, Divider, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";
import HeaderBar from "../header/header";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";
import RequiredLogin from "../dialog/loginRequired";


export default function ProductDetailsPage() {

    const { productId } = useParams();
    // const src = "https://www.chelseacats.co.uk/wp-content/uploads/2017/03/Cheahire-Wain-navy-blue-luxury-leather-cat-collar.jpg";

    const [product, setProduct] = useState<any>([]);
    const [colorError] = useState<any>(null);
    const [sizeError] = useState<any>(null);
    const [leadError] = useState<any>(null);
    const [sizeId, setSizeId] = useState<number | null>(null);
    const [lengthId, setLengthId] = useState<number | null>(null);
    const [variationId, setVariationId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number | null>(null);
    const [productIdToCart, setProductIdToCart] = useState<number | null>(null);

    const [requiredLoginDialog, setRequiredLoginDialog] = useState(false);

    useEffect(() => {
        // Make an asynchronous request to fetch data
        async function fetchData() {
            try {
                const productUrl = `https://purrfectpawsshopapi.azurewebsites.net/api/TProductDetails/Product/${productId}`;
                const productResponse = await axios.get(productUrl);
                // console.log(productResponse.data.images[0].blobStorageId, 'productDetail');

                setProduct(productResponse.data); // Update the state with the fetched data

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData(); // Call the fetchData function when the component mounts

    }, []);

    useEffect(() => {
        const getProductQuantity = async (url: string) => {
            try {
                // const url = `https://localhost:7224/api/TProductDetails/Quantity/${product.productDetailsId}/${sizeId}/${variationId}/${lengthId}`;
                const response = await axios.get(url);
                setQuantity(response.data.quantity)
                setProductIdToCart(response.data.productId)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        if (product?.productDetailsId && sizeId != null && variationId != null) {
        getProductQuantity(`https://purrfectpawsshopapi.azurewebsites.net/api/TProductDetails/Quantity/${product.productDetailsId}/${sizeId}/${variationId}/0`)
        } else if (product?.productDetailsId && lengthId != null && variationId != null) {
        getProductQuantity(`https://purrfectpawsshopapi.azurewebsites.net/api/TProductDetails/Quantity/${product.productDetailsId}/0/${variationId}/${lengthId}`)
        }

    }, [sizeId, variationId, lengthId])

    const handleRadioChangeSize = (event: any) => {
        const selectedValue = event.target.value;
        setSizeId(selectedValue)
        console.log(selectedValue, 'selectedValue size')
    }

    const handleRadioChangeColor = (event: any) => {
        const selectedValue = event.target.value;
        setVariationId(selectedValue)
        console.log(selectedValue, 'selectedValue variation')
    }

    const handleRadioChangeLead = (event: any) => {
        const selectedValue = event.target.value;
        setLengthId(selectedValue)
        console.log(selectedValue, 'selectedValue length')
    }

    const checkUserLogin = () => {
        if(sessionStorage.getItem('userId') == null){
            setRequiredLoginDialog(true);
        } else{
            onClickAddtoCart();
        }
    }

    async function onClickAddtoCart() {
        
        try {
            const url = `https://purrfectpawsshopapi.azurewebsites.net/api/TCarts`;
            const response = await axios({ url, method: 'POST', data: { productId: productIdToCart, userId: sessionStorage.getItem('userId') } });
            setQuantity(response.data.quantity)
            console.log('updateing cart');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
            
        // if (selectedProduct.color) {
        //     setColorError(null)
        // } else {
        //     setColorError("Please select a color before adding to cart.")
        // }

        // if (selectedProduct.size) {
        //     setSizeError(null)
        // } else {
        //     setSizeError("Please select a size before adding to cart.")
        // }

        // if (selectedProduct.leadLength) {
        //     setLeadError(null)
        // } else {
        //     setLeadError("Please select a lead length before adding to cart.")
        // }

        // if (colorError === null && leadError === null && sizeError === null) {
        //     console.log("OK")
        //     setSelectedProduct({
        //         ...product,
        //         ...selectedProduct,
        //     })
        // } else {
        //     console.log("Error")
        // }
        
    }

    return (
        <>
        {requiredLoginDialog && <RequiredLogin />}
        <div className='navBar'>
            <HeaderBar />
        </div>
            <Card sx={{ maxWidth: 1000, maxHeight: 700 }}>
                <><CardMedia
                    sx={{ height: 300, width: 500 }}
                    image={product.images ? product.images[0].blobStorageId : ""}
                    title="green iguana" />
                    <Divider sx={{ borderBottomWidth: 3 }} />
                    <CardContent>
                        <Grid item>
                            <Typography gutterBottom variant="h4" component="div" align="left">
                                {product?.productName}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography gutterBottom variant="h5" component="div" align="left">
                                {product?.productDescription}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography gutterBottom variant="h5" component="div" align="left">
                                RM {parseFloat(product?.productPrice).toFixed(2)}
                            </Typography>
                        </Grid>
                        <div style={{ width: '100%' }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 6fr)' }}>
                                <FormControl >
                                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{ display: "flex" }}>Colour</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                    >
                                        {product.variations ? product.variations.map((item: any, index: any) => (
                                            <FormControlLabel
                                                key={index}
                                                value={item?.variationId}
                                                control={<Radio />}
                                                label={item?.variationName}
                                                onChange={handleRadioChangeColor}
                                            />
                                        )) : ""}
                                    </RadioGroup>
                                    {colorError && (
                                        <Typography color="error" ml="-160px">
                                            {colorError}
                                        </Typography>
                                    )}
                                </FormControl>
                                {product.sizes && product.sizes[0] ?
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ display: "flex" }}>Size</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >
                                            {product.sizes ? product.sizes.map((item: any, index: any) => (
                                                <FormControlLabel
                                                    key={index}
                                                    value={item?.sizeId}
                                                    control={<Radio />}
                                                    label={item?.sizeLabel}
                                                    onChange={handleRadioChangeSize}
                                                />
                                            )) : ""}
                                        </RadioGroup>
                                        {sizeError && (
                                            <Typography color="error" ml="-160px">
                                                {sizeError}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    : ""}
                                {product.leadLengths && product.leadLengths[0] ?
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ display: "flex" }}>Lead</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >
                                            {product.leadLength ? product.leadLength.map((item: any, index: any) => (
                                                <FormControlLabel
                                                    key={index}
                                                    value={item?.leadLengthId}
                                                    control={<Radio />}
                                                    label={`${item?.leadLength} meter`}
                                                    onChange={handleRadioChangeLead}
                                                />
                                            )) : ""}
                                        </RadioGroup>
                                        {leadError && (
                                            <Typography color="error" ml="-120px">
                                                {leadError}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    : ""}
                                {quantity != null && quantity >= 0 ?
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ display: "flex" }}>Quantity: {quantity}</FormLabel>
                                    </FormControl>
                                    : ""}
                            </Box>
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 1, mb: 2, backgroundColor:"#ceebfa" }}
                            size="small"
                            onClick={() => checkUserLogin()}
                            disabled={variationId != null && (sizeId != null || lengthId != null) ? false : true}
                        >
                            Add to cart
                        </Button>
                    </CardActions></>
            </Card></>

    )

}