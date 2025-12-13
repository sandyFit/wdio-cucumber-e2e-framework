const axios = require('axios');
const config = require('../config/config');

class BookingService {
    constructor() {
        this.client = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Track request start time for response time assertions
        this.client.interceptors.request.use((requiestConfig) => {
            requiestConfig.metadata = { startTime: Date.now() };
            return requiestConfig;
        });

        // Calculate response time
        this.client.interceptors.response.use((response) => {
            response.config.metadata.endTime = Date.now();
            response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
            return response;
        });
    };

    

    /**
     * Create authentication token for protected endpoints
     * @returns {Promise} Response with token
     */
    async createAuthToken() {
        try {
            const response = await this.client.post(config.endpoints.auth, {
                username: config.auth.username,
                password: config.auth.password
            });
            return response;
        } catch (error) {
            throw this._handleError(error);
        }
    };



    /**
     * Get all booking IDs with optional filters
     * @param {Object} filters - Query parameters (firstname, lastname, checkin, checkout)
     * @returns {Promise} Response with booking IDs array
     */
    async getAllBookingIds(filters = {}) {
        try {
            const response = await this.client.get(config.endpoints.booking, {
                params: filters
            });
            return response;
        } catch (error) {
            throw this._handleError(error);
        }
    };



    /**
     * Create a new booking
     * @param {Object} bookingData - Booking details
     * @returns {Promise} Response with created booking
     */
    async createBooking(bookingData) {
        try {
            const response = await this.client.post(config.endpoints.booking, bookingData);
            return response;
        } catch (error) {
            throw this._handleError(error);
        }
    };



    /**
     * Get booking details by ID
     * @param {number} id - Booking ID
     * @returns {Promise} Response with booking details
     */
    async getBookingById(id) {
        try {
            const response = await this.client.get(config.endpoints.bookingById(id));
            return response;
        } catch (error) {
            throw this._handleError(error);
        }
    };



    /**
    * Update booking (PUT - full update)
    * @param {number} id - Booking ID
    * @param {Object} bookingData - Complete booking details
    * @param {string} token - Auth token
    * @returns {Promise} Response with updated booking
    */
    async updateBooking(id, bookingData, token) {
        try {
            const response = await this.client.put(
                config.endpoints.bookingById(id),
                bookingData,
                {
                    headers: {
                        'Cookie': `token=${token}`,
                        'Authorization': `Basic ${this._encodeCredentials()}`
                    }
                }
            );
            return response;
        } catch (error) {
            throw this._handleError(error);
        }
    };



    /**
     * Partially update booking (PATCH)
     * @param {number} id - Booking ID
     * @param {Object} partialData - Partial booking details
     * @param {string} token - Auth token
     * @returns {Promise} Response with updated booking
     */
    async partialUpdateBooking(id, partialData, token) {
        try {
            const response = await this.client.patch(
                config.endpoints.bookingById(id),
                partialData,
                {
                    headers: {
                        'Cookie': `token=${token}`,
                        'Authorization': `Basic ${this._encodeCredentials()}`
                    }
                }
            );
            return response;
        } catch (error) {
            throw this._handleError(error);
        }
    };



    /**
     * Delete booking
     * @param {number} id - Booking ID
     * @param {string} token - Auth token
     * @returns {Promise} Response
     */
    async deleteBooking(id, token) {
        try {
            const response = await this.client.delete(
                config.endpoints.bookingById(id),
                {
                    headers: {
                        'Cookie': `token=${token}`,
                        'Authorization': `Basic ${this._encodeCredentials()}`
                    }
                }
            );
            return response;
        } catch (error) {
            throw this._handleError(error);
        }
    };



    /**
     * Encode credentials for Basic Auth header
     * @private
     * @returns {string} Base64 encoded credentials
     */
    _encodeCredentials() {
        const credentials = `${config.auth.username}:${config.auth.password}`;
        return Buffer.from(credentials).toString('base64');
    };



    /**
     * Error handler for consistent error format
     * @private
     * @param {Error} error - Axios error
     * @returns {Error} Formatted error
     */

    /**
     * Error handler for consistent error format
     * @private
     * @param {Error} error - Axios error
     * @returns {Error} Formatted error
     */
    _handleError(error) {
        if (error.response) {
            // Server responded with error status
            const err = new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
            err.status = error.response.status;
            err.data = error.response.data;
            return err;
        } else if (error.request) {
            // Request made but no response
            return new Error('No response from server');
        } else {
            // Error in request setup
            return error;
        }
    }
}
module.exports = BookingService;
