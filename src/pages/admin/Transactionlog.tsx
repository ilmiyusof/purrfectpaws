import { Alert, Card, MenuItem, Select, SelectChangeEvent, Snackbar, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import HeaderBar from '../../header/header.tsx';
import '../../css/home.css';
import { useEffect, useState } from 'react';
import React from 'react';
import { getTransactionLog, updateOrderStatus } from '../../service/api.tsx';

export default function Transactionlog() {

  const [logs, setLogs] = useState<any>([]);
  const [dateFilter, setDateFilter] = useState<string>(''); // State for date filter
  const [page, setPage] = useState<number>(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Number of rows per page
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); // State for Snackbar

  useEffect(() => {
    fetchData(); // Initial data fetch

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const response = await getTransactionLog();
      setLogs(response?.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const statusVal = [
    [1, 'preparing'],
    [2, 'shipping'],
    [3, 'delivered'],
    [4, 'shipped'],
  ];

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = async (event: SelectChangeEvent, orderMasterId: number) => {
    const orderStatusId = event.target.value as string;


    updateOrderStatus(orderMasterId, orderStatusId).then(() => {
      setSnackbarOpen(true);
      fetchData();
    })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
  };

  const filteredLogs = logs.filter((log: any) => {
    if (!dateFilter) {
      return true; // No filter applied, show all data
    }
    // Convert the date (yyyy-MM-dd)
    const formattedDate = new Date(log.transactionDate).toISOString().slice(0, 10);
    // Check if the formatted date matches the filter value
    return formattedDate === dateFilter;
  });

  return (
    <React.Fragment>
      <div className='navBar'>
        <HeaderBar />
      </div>
      <Typography mb={3} component="h1" variant="h5"> Transaction Log</Typography>
      <Card>
        {/* Date Filter Input */}
        <div style={{ margin: '16px' }}>
          <TextField
            id="date-filter"
            label="Filter by Date"
            type="date"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => handleDateFilterChange(e.target.value)}
          />
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align='center'>Order ID</TableCell>
              <TableCell align='center'>Date</TableCell>
              <TableCell align='center'>Customer Name</TableCell>
              <TableCell align='center'>Ship To</TableCell>
              <TableCell align='center'>Payment Method</TableCell>
              <TableCell align='center'>Payment Status</TableCell>
              <TableCell sx={{ minWidth: 120 }} align='center'>Order Status</TableCell>
              <TableCell align="right">Transaction Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log: any) => (
              <TableRow key={log.transactionId}>
                <TableCell align='center'>{log.transactionId}</TableCell>
                <TableCell align='center'>{new Date(log.transactionDate).toLocaleString()}</TableCell>
                <TableCell align='center'>{log.transactionOrderMaster.user.name}</TableCell>
                <TableCell align='center'>
                  {log.transactionOrderMaster.tOrders[0]?.shippingAddress && (
                    `${log.transactionOrderMaster.tOrders[0]?.shippingAddress?.street1}, 
                                  ${log.transactionOrderMaster.tOrders[0]?.shippingAddress?.street2}, 
                                  ${log.transactionOrderMaster.tOrders[0]?.shippingAddress?.postcode}, 
                                  ${log.transactionOrderMaster.tOrders[0]?.shippingAddress?.city}, 
                                  ${log.transactionOrderMaster.tOrders[0]?.shippingAddress?.state}, 
                                  ${log.transactionOrderMaster.tOrders[0]?.shippingAddress?.country}`
                  )}
                </TableCell>
                <TableCell align='center'>{"Card"}</TableCell>
                <TableCell align='center'>{log.paymentStatus.paymentStatus}</TableCell>
                <TableCell>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={log.transactionOrderMaster.tOrders[0]?.orderStatus?.orderStatusId}
                    label="Status"
                    onChange={(event) => handleChange(event, log.orderMasterId)}
                  >
                    {statusVal.map(([key, item]) => (
                      <MenuItem key={key} value={key}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align='center'>{`RM ${parseFloat(log.transactionAmount).toFixed(2)}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={() => handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Status updated successfully!
        </Alert>
      </Snackbar>

    </React.Fragment>
  )
}
