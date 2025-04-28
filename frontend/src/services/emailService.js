import axios from 'axios';

export const sendEmailConfirmation = async (userEmail, orderDetails) => {
    try {
        const response = await axios.post('http://localhost:5003/api/email/send', {
            email: userEmail,
            orderDetails: orderDetails
        });
        console.log('Email sent:', response.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
