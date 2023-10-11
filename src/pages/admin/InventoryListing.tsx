import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Typography,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    TableContainer,
    Table as MuiTable,
    TableCell as MuiTableCell,
    TableBody as MuiTableBody,
    TableRow as MuiTableRow,
    tableCellClasses,
    DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderBar from "../../header/header";
import DeleteSuccessAdmin from "../../dialog/deleteSuccessAdmin";
import TablePagination from "@mui/material/TablePagination";

export default function InventoryListing() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState<any[]>([]);
    const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVariations, setSelectedVariations] = useState<any[]>([]);
    const [selectedProductDetailsId, setSelectedProductDetailsId] = useState<any | null>(null);

    useEffect(() => {
        // Make an asynchronous request to fetch data
        async function fetchData() {
            try {
                const response = await axios.get("https://purrfectpawsshopapi.azurewebsites.net/api/TProducts");
                setInventory(response.data); // Update the state with the fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData(); // Call the fetchData function when the component mounts
    }, []);

    const groupInventoryByProductDetailsId = () => {
        const groupedInventory: any[] = [];

        inventory.forEach((item: any) => {
            const existingGroup = groupedInventory.find(
                (group) => group.productDetailsId === item.productDetailsId
            );

            if (existingGroup) {
                // Add the item to an existing group
                existingGroup.variations.push(item.productVariation);
                existingGroup.sizes.push(item.productSize ? item.productSize : item.productLength);
                existingGroup.quantities.push(item.stockQuantity);
                existingGroup.prices.push(item.productPrice);
            } else {
                // Create a new group for the productDetailsId
                groupedInventory.push({
                    productDetailsId: item.productDetailsId,
                    productName: item.productName,
                    productImages: item.productImages,
                    variations: [item.productVariation],
                    sizes: [item.productSize ? item.productSize : item.productLength],
                    quantities: [item.stockQuantity],
                    prices: [item.productPrice],
                });
            }
        });

        return groupedInventory;
    };

    const groupedInventory = groupInventoryByProductDetailsId();

    const StyledTableCell = styled(MuiTableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#ceebfa",
            color: theme.palette.common.black,
            fontSize: 20,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 18,
        },
    }));

    const StyledTableRow = styled(MuiTableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    const onClickEdit = (id: number) => {
        navigate(`/inventoryPage/${id}`);
    };

    const onClickAddNewItem = () => {
        navigate(`/inventoryAddPage`);
    };

    const onClickDelete = () => {
        setShowDeleteSuccessDialog(true);
    };

    // Slice the displayed rows based on the current page and rows per page
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedRows = groupedInventory.slice(startIndex, endIndex);

    // Function to handle opening the dialog and setting the selected variations
    const openVariationsDialog = (
        productDetailsId: number,
        variations: any[],
        sizes: any[],
        prices: any[],
        quantities: any[]
    ) => {
        // Combine variations, sizes, prices, and quantities into an array of objects
        const selectedVariationsData = variations.map((variation, index) => ({
            variation,
            size: sizes[index],
            price: prices[index],
            quantity: quantities[index],
        }));

        setSelectedProductDetailsId(productDetailsId);
        setSelectedVariations(selectedVariationsData);
        setOpenDialog(true);
    };

    // Function to handle closing the dialog
    const closeVariationsDialog = () => {
        setOpenDialog(false);
    };

    console.log(selectedVariations, "asd")
    console.log(displayedRows, "er")
    return (
        <>
            {showDeleteSuccessDialog && <DeleteSuccessAdmin />}
            <Container>
                <div className="navBar">
                    <HeaderBar />
                </div>
            </Container>
            <Container>
                <Typography mb={3} component="h1" variant="h5">
                    Inventory listing
                </Typography>
            </Container>
            <Container>
                <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "30px" }}>
                    <Table aria-label="sticky table" sx={{ minWidth: 700}}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell align="center">Item</StyledTableCell>
                                <StyledTableCell align="center">Price</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedRows?.map((group: any) => (
                                <React.Fragment key={group?.productDetailsId}>
                                    <StyledTableRow>
                                        <StyledTableCell align="center">
                                            <Avatar src={group?.productImages[0]?.blobImageUrl} />
                                        </StyledTableCell>
                                        <StyledTableCell
                                            component="th"
                                            scope="row"
                                            align="center"
                                        >
                                            <Button
                                                onClick={() => openVariationsDialog(group?.productDetailsId,group?.variations,
                                                    group?.sizes,
                                                    group?.prices,
                                                    group?.quantities)}
                                            >
                                                {group?.productName}
                                            </Button>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{`RM ${parseFloat(
                                            group?.prices[0] // Assuming prices is an array, use the first element
                                        ).toFixed(2)}`}</StyledTableCell>
                                        <StyledTableCell
                                            align="center"
                                            onClick={() => onClickDelete()}
                                        >
                                            <DeleteIcon />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={groupedInventory?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
                <Button
                    type="submit"
                    variant="outlined"
                    sx={{ mt: 1, mb: 2, backgroundColor: "#ceebfa" }}
                    size="small"
                    onClick={() => onClickAddNewItem()}
                >
                    Add new item
                </Button>
            </Container>
            <Dialog
                open={openDialog}
                onClose={closeVariationsDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Product Variations</DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <MuiTable>
                            <TableHead>
                                <MuiTableRow>
                                    <MuiTableCell align="center">Variation</MuiTableCell>
                                    <MuiTableCell align="center">Size/Lead Length(meter)</MuiTableCell>
                                    <MuiTableCell align="center">Price</MuiTableCell>
                                    <MuiTableCell align="center">Quantity</MuiTableCell>
                                </MuiTableRow>
                            </TableHead>
                            <MuiTableBody>
                                {selectedVariations.map((variation, index) => (
                                    <MuiTableRow key={index}>
                                        <MuiTableCell align="center">{variation.variation}</MuiTableCell>
                                        <MuiTableCell align="center">{variation.size}</MuiTableCell>
                                        <MuiTableCell align="center">{`RM ${parseFloat(variation.price).toFixed(2)}`}</MuiTableCell>
                                        <MuiTableCell align="center">{variation.quantity}</MuiTableCell>
                                    </MuiTableRow>
                                ))}
                            </MuiTableBody>
                        </MuiTable>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={{ mt: 1, mb: 2, backgroundColor: "#ceebfa" }}
                        size="small"
                        onClick={() => onClickEdit(selectedProductDetailsId)}
                    >
                        EDIT
                    </Button>
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={{ mt: 1, mb: 2,mr:3, backgroundColor: "#ceebfa" }}
                        size="small"
                        onClick={closeVariationsDialog} color="primary">
                        OK
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    );
}
