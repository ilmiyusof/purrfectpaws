/* eslint-disable no-unsafe-optional-chaining */
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Slide,
  TextField
} from "@mui/material";
import HeaderBar from "../../header/header";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import axios from "axios";
import { TransitionProps } from "react-transition-group/Transition";
import React from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function InventoryAddPage() {
  const [product, setProduct] = useState<any>({
    productName: "",
    productDescription: "",
    productPrice: 0,
    // sizeId: "",
    // leadLengthId: "",
    // variationId: 0,
    //productQuantity: 0,
    //productVariations: [], // Add an empty array for productVariations
  });

  // const [variation, setVariation] = useState<any>([]);
  // const [size, setSize] = useState<any>([]);
  // const [length, setLength] = useState<any>([]);
  // const [productDetails, setProductDetails] = useState<any[]>([]);


  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  // useEffect(() => {
  //   // Make an asynchronous request to fetch data
  //   async function fetchData() {
  //     try {
  //       const variationUrl = `https://purrfectpawsshopapi.azurewebsites.net/api/TVariations`;
  //       const sizeUrl = `https://purrfectpawsshopapi.azurewebsites.net/api/MSizes`;
  //       const lengthUrl = `https://purrfectpawsshopapi.azurewebsites.net/api/TLeadLengths`;
  //       const variationResponse = await axios.get(variationUrl);
  //       const sizeResponse = await axios.get(sizeUrl);
  //       const lengthResponse = await axios.get(lengthUrl);
  //       setVariation(variationResponse.data);
  //       setSize(sizeResponse.data);
  //       setLength(lengthResponse.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }

  //   fetchData(); // Call the fetchData function when the component mounts

  // }, []);

  // const handleDeleteOption = (index: number) => {
  //   setProductDetails((prevDetails) => {
  //     const updatedDetails = [...prevDetails];
  //     updatedDetails.splice(index, 1);
  //     return updatedDetails;
  //   });
  // };

  // const handleAdd = () => {
  //   const newProduct = {
  //     size: size[0]?.sizeId || "", // Use the first available size ID
  //     variation: variation[0]?.variationId || "", // Use the first available variation ID
  //     leadLength: length[0]?.leadLengthId || "", // Use the first available lead length ID
  //     productQuantity: product.productQuantity || "",
  //   };
  //   setProductDetails((prevDetails) => [...prevDetails, newProduct]);
  // };

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
    field: string
  ) => {
    const { value } = event.target || {};

    if (field === 'productName' || field === 'productDescription') {
      setProduct((prevProduct: any) => ({
        ...prevProduct,
        [field]: value,
      }));
    } else if (field === 'productPrice') {
      // Handle numeric format changes and directly update productPrice in the product state
      const floatValue = parseFloat(value as string);
      setProduct((prevProduct: any) => ({
        ...prevProduct,
        productPrice: isNaN(floatValue) ? 0 : floatValue,
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0] ?? null;
    setSelectedImage(file);
  };

  console.log(selectedImage, "asd")

  const onClickAdd = async () => {
    const formData = new FormData();
    // for (let i = 0; selectedImage?.length; i < 0) {
    //   selectedImage.
    // }

    // Append the form fields to the FormData object
    formData.append("productName", product.productName);
    formData.append("productDescription", product.productDescription);
    formData.append("productPrice", product.productPrice);
    formData.append("images", product.productPrice);
    try {
      // Step 1: Create a new product details entry
      const productDetailsResponse = await axios.post("https://purrfectpawsshopapi.azurewebsites.net/api/TProductDetails", formData);
      console.log(productDetailsResponse, "response")
      setOpenDialog(true);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const closeDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <div className="navBar">
        <HeaderBar />
      </div>
      <Container sx={{ marginTop: "70px" }}>
        <Card sx={{ marginTop: "70px" }}>
          <CardMedia
            component="img"
            sx={{
              width: 400,
              height: 200,
              textAlign: "center",
              display: "inline-block",
              objectFit: "contain",
            }}
            image={selectedImage ? URL.createObjectURL(selectedImage) : ""}
          />
          <CardContent sx={{ flex: "1 0 auto" }}>
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              multiple
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                sx={{ mb: 2, backgroundColor: "#ceebfa" }}
                size="small"
              >
                Upload Image
              </Button>
            </label>
            <Grid spacing={1}>
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": {
                    m: 1,
                    width: "25ch",
                  },
                  textAlign: "left",
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  autoComplete="name"
                  name="productName"
                  required
                  fullWidth
                  id="productName"
                  label="Product Name"
                  autoFocus
                  size="small"
                  onChange={(event) => handleFieldChange(event, 'productName')}
                  value={product.productName}
                />

                <TextField
                  label="Product description"
                  id="productDescription"
                  name="productDescription"
                  defaultValue="Small"
                  size="small"
                  fullWidth
                  required
                  value={product.productDescription || ""}
                  onChange={(event) => handleFieldChange(event, 'productDescription')}
                />
                <NumericFormat
                  customInput={TextField}
                  autoComplete="productPrice"
                  name="productPrice"
                  required
                  fullWidth
                  id="productPrice"
                  label="Price"
                  autoFocus
                  size="small"
                  value={`RM ${parseFloat(product.productPrice || 0).toFixed(
                    2
                  )}`}
                  onChange={(event) => handleFieldChange(event, 'productPrice')}
                />
              </Box>
              {/* {productDetails.map((newProduct, index) => (
                <>
                  <div>
                    <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                      <InputLabel id="demo-select-small-label">Variation</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id={`variation-select-${index}`}
                        value={newProduct.variation}
                        label="Variation"
                        name={`variation-${index}`}
                        onChange={(event) => handleFieldChange(event as React.ChangeEvent<HTMLInputElement>, index, 'variation')}
                      >
                        {variation?.map((item: any) => (
                          <MenuItem value={item?.variationId} key={item.variationId}>{item?.variationName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                      <InputLabel id="demo-select-small-label">Size</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id={`size-select-${index}`}
                        value={newProduct?.size}
                        onChange={(event) => handleFieldChange(event as React.ChangeEvent<HTMLInputElement>, index, 'size')}
                        name={`size-${index}`}
                      >
                        {size?.map((item: any) => (
                          <MenuItem value={item?.sizeId} key={item.sizeId}>{item?.sizeLabel}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                      <InputLabel id="demo-select-small-label">Lead Length</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id={`leadLength-select-${index}`}
                        value={newProduct?.length}
                        label="Lead length"
                        name={`leadLength-${index}`}
                        onChange={(event) => handleFieldChange(event as React.ChangeEvent<HTMLInputElement>, index, 'leadLength')}
                      >
                        {length?.map((item: any) => (
                          <MenuItem value={item?.leadLengthId} key={item.leadLengthId}>{`${item?.leadLength} m`}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Quantity"
                      id={`productQuantity-${index}`}
                      name={`productQuantity-${index}`}
                      style={{
                        marginBottom: "8px",
                        marginRight: "8px",
                        marginLeft: "10px",
                        marginTop: "9px"
                      }}
                      value={newProduct?.quantity}
                      onChange={(event) => handleFieldChange(event, index, 'productQuantity')}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ mt: "13px" }}
                      onClick={() => handleDeleteOption(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              ))} */}
              {/* <div style={{ textAlign: "center" }}>
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={handleAdd}
                >
                  ADD VARIATIONS
                </Button>
              </div> */}
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mb: 2, backgroundColor: "#ceebfa" }}
              size="small"
              onClick={() => onClickAdd()}
            >
              Add
            </Button>
          </CardActions>
        </Card>
      </Container>
      <div>
        <Dialog
          open={openDialog}
          onClose={closeDialog}
          TransitionComponent={Transition}
          keepMounted
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
              <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
            </Avatar></Box>
          <DialogTitle>{"Item Added"}</DialogTitle>
          <DialogActions>
            <Button onClick={closeDialog} color='error'>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
