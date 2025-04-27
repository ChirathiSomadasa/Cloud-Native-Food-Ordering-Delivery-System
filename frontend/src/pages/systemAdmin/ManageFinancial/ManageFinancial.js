import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function ManageFinancial() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch all payments from the backend
    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                throw new Error("Authentication token not found");
            }
            // Debug: Log the token payload
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', tokenPayload);

            const response = await fetch(`http://localhost:5010/api/payment/all`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            // Debug: Log the response status and headers
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (response.status === 403) {
                const errorData = await response.json();
                console.log('Error data:', errorData);
                throw new Error(errorData.message );
            }

            if (!response.ok) {
                throw new Error("Failed to fetch payments");
            }

            const data = await response.json();
            console.log('Received data:', data);
            // setPayments(data);
            if (Array.isArray(data)) {
                setPayments(data);
            } else if (Array.isArray(data.payments)) {
                setPayments(data.payments);
            } else {
                throw new Error("Invalid data format: expected an array");
            }
            
            setLoading(false);
        } catch (err) {
            console.error('Error details:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();

        // Set up fetch payments every 30 seconds
        const interval = setInterval(() => {
            fetchPayments();
        }, 30000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Function to handle payment deletion
    const handleDeletePayment = async (paymentId) => {
        if (window.confirm("Are you sure you want to delete this payment record?")) {
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const response = await fetch(
                    `http://localhost:5010/api/payment/${paymentId}`,
                    {
                        method: "DELETE",
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );

                if (response.status === 403) {
                    throw new Error("Access forbidden - Admin rights required");
                }

                if (!response.ok) {
                    throw new Error("Failed to delete payment");
                }

                setPayments(payments.filter((payment) => payment._id !== paymentId));
                alert("Payment deleted successfully");
            } catch (err) {
                alert(`Error deleting payment: ${err.message}`);
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Error: {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Payment Management
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 2, mb: 10 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Customer ID</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Payment ID</TableCell>
                            <TableCell>Restaurant Order ID</TableCell>
                            <TableCell>Payer Name</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Payment Details</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment._id}>
                                <TableCell>{payment.customerId}</TableCell>
                                <TableCell>
                                    {payment.customerFirstName} {payment.customerLastName}
                                </TableCell>
                                <TableCell>{payment._id}</TableCell>
                                <TableCell>{payment.restaurantOrderId}</TableCell>
                                <TableCell>{payment.payerName}</TableCell>
                                <TableCell>
                                    {payment.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    {new Date(payment.paidAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label="View Details"
                                        color="primary"
                                        size="small"
                                        onClick={() => alert(JSON.stringify(payment.paymentDetails, null, 2))}
                                    />
                                </TableCell>
                                <TableCell>
                                    <DeleteIcon
                                        sx={{ cursor: "pointer", color: "error.main" }}
                                        onClick={() => handleDeletePayment(payment._id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ManageFinancial;