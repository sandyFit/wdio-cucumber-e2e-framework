require('dotenv').config();

const config = {
    baseURL: process.env.BASE_URL || 'https://restful-booker.herokuapp.com',

    auth: {
        username: process.env.AUTH_USERNAME || 'admin',
        password: process.env.AUTH_PASSWORD || 'password123'
    },

    // API Endpoints
    endpoints: {
        auth: '/auth',
        booking: '/booking',
        bookingById: (id) => `/booking/${id}`,
        ping: '/ping'
    },

    // Test configuration
    timeout: parseInt(process.env.REQUEST_TIMEOUT) || 5000,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,

    //  Assertion expected response times 
    expectedResponseTime: {
        fast: 1000,
        medium: 2000,
        slow: 5000
    }
};

module.exports = config;

