/* eslint-disable no-unsafe-optional-chaining */
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container,  Grid, TextField, Typography } from "@mui/material";
import HeaderBar from "../../header/header";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";
import { NumericFormat } from "react-number-format";

export default function InventoryEditPage() {

    const { id } = useParams();
    // const src = "https://www.chelseacats.co.uk/wp-content/uploads/2017/03/Cheahire-Wain-navy-blue-luxury-leather-cat-collar.jpg";
    console.log(id, "id")
    const [product, setProduct] = useState<any>([]);
    // const [sizeId, setSizeId] = useState<number | null>(null);
    // const [lengthId, setLengthId] = useState<number | null>(null);
    // const [variationId, setVariationId] = useState<number | null>(null);
    // const [quantity, setQuantity] = useState<number | null>(null);

    useEffect(() => {
        // Make an asynchronous request to fetch data
        async function fetchData() {
            try {
                // const productUrl = `https://purrfectpawsshopapi.azurewebsites.net/api/TProductDetails/Product/${id}`;
                const productUrl = `https://localhost:7224/api/TProducts/DetailList/${id}`;
                const productResponse = await axios.get(productUrl);
                // console.log(productResponse.data.images[0].blobStorageId, 'productDetail');

                setProduct(productResponse.data); // Update the state with the fetched data

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData(); // Call the fetchData function when the component mounts

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    const handleDeleteOption = (type: string, index: number) => {
        const updatedProduct = { ...product };
        if (type === "Size" && updatedProduct.sizes) {
            updatedProduct.sizes.splice(index, 1); // Remove the size at the specified index
            updatedProduct.variations.splice(index, 1);
        } else if (type === "LeadLength" && updatedProduct.leadLengths) {
            updatedProduct.leadLengths.splice(index, 1); // Remove the lead length at the specified index
            updatedProduct.variations.splice(index, 1);
        }
    
        // Update the state with the modified product
        setProduct(updatedProduct);
    }

    console.log(product, "sada")

    const handleAdd = (type:string) => {
        const updatedProduct = { ...product };
    if (type === "Size") {
        if (!updatedProduct.tDetails) {
            updatedProduct.tDetails = [];
        }
        updatedProduct.tDetails.push({
            sizeLabel: "", // Initialize with an empty value
            productQuantity: "", // Initialize with an empty value
        });
        // updatedProduct.variations.push({
        //     variationName: "", // Initialize with an empty value
        //     productQuantity: "",
        // });
    } else if (type === "LeadLength") {
        if (!updatedProduct.tDetails) {
            updatedProduct.tDetails = [];
        }
        updatedProduct.tDetails.push({
            leadLength: "", // Initialize with an empty value
            productQuantity: "", // Initialize with an empty value
        });
        // updatedProduct.variations.push({
        //     variationName: "", // Initialize with an empty value
        //     productQuantity: "",
        // });
    }

    // Update the state with the modified product
    setProduct(updatedProduct);
    }

    const handleFieldChange = (index: number, type: string, fieldName: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedProduct = { ...product };
        
        if (type === "Size" && updatedProduct.tDetails && updatedProduct.tDetails[index]) {
            updatedProduct.tDetails[index][fieldName] = fieldName == "sizeLabel" ? event.target.value : +event.target.value;
        } else if (type === "LeadLength" && updatedProduct.tDetails && updatedProduct.tDetails[index]) {
            updatedProduct.tDetails[index][fieldName] = fieldName == "leadLength" ? event.target.value : +event.target.value;
        } else if (type === "Color" && updatedProduct.variations && updatedProduct.variations[index]) {
            updatedProduct.variations[index][fieldName] = event.target.value;
        } else if (fieldName === "productName") {
            updatedProduct.productName = event.target.value;
        } else if (fieldName === "productDescription") {
            updatedProduct.productDescription = event.target.value;
        } else if (fieldName === "productPrice") {
            updatedProduct.productPrice = event.target.value
        }
    
        setProduct(updatedProduct);
    }

    function onClickUpdate() {
        //todo
        console.log("update button", product)
        // const productUrl = `https://localhost:7224/api/TProducts/DetailList/${id}`;
        // const updatedResponse = await axios.get(productUrl);
    }

    return (
        <>
            <div className='navBar'>
                <HeaderBar />
            </div>
            <Container sx={{ marginTop: "70px" }}>
                <Card sx={{ marginTop: "70px" }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 400, height: 200, textAlign: "center", display: "inline-block",objectFit: "contain" }}
                        image={product.images ? product.images[0].blobStorageId : ""}
                        alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Grid spacing={1}>
                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': { m: 1, width: '25ch' }, textAlign:"left"
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    label="Product name"
                                    id="name"
                                    defaultValue="Small"
                                    size="small"
                                    fullWidth
                                    required
                                    value={product?.productName}
                                    onChange={(event) => handleFieldChange(0, "Product", "productName", event as React.ChangeEvent<HTMLInputElement>)}
                                />
                                <TextField
                                    label="Product description"
                                    id="name"
                                    defaultValue="Small"
                                    size="small"
                                    fullWidth
                                    required
                                    value={product?.productDescription}
                                    onChange={(event) => handleFieldChange(0, "Product", "productDescription", event as React.ChangeEvent<HTMLInputElement>)}
                                />
                                 <NumericFormat
                                        customInput={TextField}
                                        autoComplete="price"
                                        name="price"
                                        required
                                        fullWidth
                                        id="price"
                                        label="Price"
                                        autoFocus
                                        size="small"
                                        value={`RM ${parseFloat(product.productPrice).toFixed(2)}`}
                                        onChange={(event) => handleFieldChange(0, "Product", "productPrice", event)}
                                    />
                            </Box>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginLeft: "10px" }}>
                                <div style={{ marginBottom: '16px', marginRight: '7px', paddingRight: "30" }}>
                                    <Typography textAlign={"left"}>
                                        Colour
                                    </Typography>
                                    {product.tDetails ? product.tDetails.map((item: any, index: any) => (
                                        <div key={index}>
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                value={item?.variationName}
                                                style={{ marginBottom: '8px', marginRight: '8px' }}
                                                onChange={(event) => handleFieldChange(index, "Color", "variationName", event as React.ChangeEvent<HTMLInputElement>)}     
                                            />
                                        </div>
                                    )) : ""}
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    {product?.tDetails && product?.tDetails[0].sizeId ?
                                        <Typography textAlign={"left"} ml={2}>
                                            Size
                                        </Typography>
                                        : ""}
                                    {product?.tDetails && product?.tDetails[0].sizeId ?
                                        (
                                            product?.tDetails.map((item: any, index: any) => (
                                                <div key={index}>
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        value={item?.sizeLabel}
                                                        style={{ marginBottom: '8px', marginRight: '8px', marginLeft: "10px" }}
                                                        onChange={(event) => handleFieldChange(index, "Size", "sizeLabel", event as React.ChangeEvent<HTMLInputElement>)}
                                                    />
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        label="Quantity"
                                                        value={+item?.productQuantity}
                                                        style={{ marginBottom: '8px', marginRight: '8px', marginLeft: "10px" }}
                                                        onChange={(event) => handleFieldChange(index, "Size", "productQuantity", event as React.ChangeEvent<HTMLInputElement>)}
                                                    />
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDeleteOption("Size", index)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>

                                            ))
                                        )
                                        : ""}
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    {product?.tDetails && product?.tDetails[0].leadLengthId ?
                                        <Typography textAlign={"left"} ml={2}>
                                            Lead Length
                                        </Typography>
                                        : ""}
                                    {product?.tDetails && product?.tDetails[0].leadLengthId ?
                                        (
                                            product?.tDetails.map((item: any, index: any) => (
                                                <div key={index}>
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        value={item?.leadLength}
                                                        style={{ marginBottom: '8px', marginRight: '8px', marginLeft: "10px" }}
                                                        onChange={(event) => handleFieldChange(index, "LeadLength", "leadLength", event as React.ChangeEvent<HTMLInputElement>)}
                                                    />
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        label="Quantity"
                                                        value={item?.productQuantity}
                                                        style={{ marginBottom: '8px', marginRight: '8px', marginLeft: "10px" }}
                                                        onChange={(event) => handleFieldChange(index, "Size", "productQuantity", event as React.ChangeEvent<HTMLInputElement>)}
                                                    />
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDeleteOption("Size", index)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            ))
                                        )
                                        : ""}
                                </div>
                            </div>
                            <div style={{textAlign:"right"}}>
                            <Button
                                variant="outlined"
                                color="success"
                                size="small"
                                onClick={() => handleAdd("Size")}
                            >
                                ADD VARIATIONS
                            </Button>
                            </div>

                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, backgroundColor: "#ceebfa" }}
                            size="small"
                            onClick={() => onClickUpdate()}
                            //disabled={variationId != null && (sizeId != null || lengthId != null) && quantity !== null ? false : true}
                        >
                            Update
                        </Button>
                    </CardActions>
                </Card>
            </Container>
        </>

    )

}