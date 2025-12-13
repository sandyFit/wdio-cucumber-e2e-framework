const { expect } = require('chai');
const BookingService = require('../services/BookingService');
const config = require('../config/config');
const {
    bookingIdsArraySchema,
    createBookingResponseSchema,
    bookingSchema,
    updateBookingResponseSchema,
    authTokenSchema
} = require('../schemas/schemas');

describe(']Restful-Booker API Tests', () => {
    let bookingService;
    let authToken;
    let createBookingId;

    // Test data 
    const testBookingData = {
        firstname: 'John',
        lastname: 'Doe',
        totalprice: 250,
        depositpaid: true,
        bookingdates: {
            checkin: '2024-01-01',
            checkout: '2024-01-05'
        },
        additionalneeds: 'Breakfast'
    };

    const minimalBookingData = {
        firstname: 'Jane',
        lastname: 'Doe',
        totalprice: 200,
        depositpaid: false,
        bookingdates: {
            checkin: '2024-02-01',
            checkout: '2024-02-03'
        }
    };

    before(async () => {
        bookingService = new BookingService();

        // Create auth token 
        const tokenResponse = await bookingService.createAuthToken();
        authToken = tokenResponse.data.token;
    });

    /**
     * TEST SUITE 1: Get Booking IDs
     * Tests GET /booking endpoint with and without filters
     */
    describe('Get Booking IDs', () => {
        it('should get all booking IDs without filters', async () => {
            const response = await bookingService.getAllBookingIds();

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.medium);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.include('application/json');

            // Assertion 4: Response Body
            expect(response.data).to.be.an('array');
            expect(response.data.length).to.be.greaterThan(0);

            // Assertion 5: Schema Validation
            const { error } = bookingIdsArraySchema.validate(response.data);
            expect(error).to.be.undefined;
        });

        it('should filter booking IDs by firstname and lastname', async () => {
            const filters = {
                firstname: 'John',
                lastname: 'Smith'
            };

            const response = await bookingService.getAllBookingIds(filters);

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.medium);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.include('application/json');

            // Assertion 4: Response Body
            expect(response.data).to.be.an('array');

            // Assertion 5: Schema Validation
            const { error } = bookingIdsArraySchema.validate(response.data);
            expect(error).to.be.undefined;
        });
    });

    /**
     * TEST SUITE 2: Create Booking
     * Tests POST /booking endpoint
     */
    describe('Create Booking', () => {
        it('should create booking with complete data', async () => {
            const response = await bookingService.createBooking(testBookingData);

            // Store booking ID for later tests
            createdBookingId = response.data.bookingid;

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.medium);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.include('application/json');

            // Assertion 4: Response Body
            expect(response.data).to.have.property('bookingid');
            expect(response.data.bookingid).to.be.a('number');
            expect(response.data.booking.firstname).to.equal(testBookingData.firstname);
            expect(response.data.booking.lastname).to.equal(testBookingData.lastname);
            expect(response.data.booking.totalprice).to.equal(testBookingData.totalprice);

            // Assertion 5: Schema Validation
            const { error } = createBookingResponseSchema.validate(response.data);
            expect(error).to.be.undefined;
        });

        it('should create booking with minimal required data', async () => {
            const response = await bookingService.createBooking(minimalBookingData);

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.medium);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['server']).to.exist;

            // Assertion 4: Response Body
            expect(response.data).to.have.property('bookingid');
            expect(response.data.booking.firstname).to.equal(minimalBookingData.firstname);
            expect(response.data.booking.depositpaid).to.equal(false);

            // Assertion 5: Schema Validation
            const { error } = createBookingResponseSchema.validate(response.data);
            expect(error).to.be.undefined;
        });
    });

    describe('Get Booking Details', () => {
        it('should get booking by valid ID', async () => {
            const response = await bookingService.getBookingById(createdBookingId);

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.fast);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.include('application/json');

            // Assertion 4: Response Body
            expect(response.data).to.have.property('firstname');
            expect(response.data).to.have.property('lastname');
            expect(response.data).to.have.property('totalprice');
            expect(response.data.firstname).to.equal(testBookingData.firstname);

            // Assertion 5: Schema Validation
            const { error } = bookingSchema.validate(response.data);
            expect(error).to.be.undefined;
        });

        /**
     * TEST SUITE 4: Update Booking
     * Tests PUT and PATCH /booking/:id endpoints with authorization
     */
    describe('Update Booking', () => {
        it('should fully update booking with PUT using Basic Auth', async () => {
            const updatedData = {
                firstname: 'UpdatedJohn',
                lastname: 'UpdatedDoe',
                totalprice: 250,
                depositpaid: false,
                bookingdates: {
                    checkin: '2024-03-01',
                    checkout: '2024-03-10'
                },
                additionalneeds: 'Lunch'
            };

            const response = await bookingService.updateBooking(
                createdBookingId,
                updatedData,
                authToken
            );

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.medium);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.include('application/json');

            // Assertion 4: Response Body - verify all fields updated
            expect(response.data.firstname).to.equal(updatedData.firstname);
            expect(response.data.lastname).to.equal(updatedData.lastname);
            expect(response.data.totalprice).to.equal(updatedData.totalprice);
            expect(response.data.depositpaid).to.equal(updatedData.depositpaid);
            expect(response.data.bookingdates.checkin).to.equal(updatedData.bookingdates.checkin);

            // Assertion 5: Schema Validation
            const { error } = updateBookingResponseSchema.validate(response.data);
            expect(error).to.be.undefined;
        });

        it('should partially update booking with PATCH using Basic Auth', async () => {
            const partialUpdate = {
                firstname: 'PartiallyUpdated',
                totalprice: 175
            };

            const response = await bookingService.partialUpdateBooking(
                createdBookingId,
                partialUpdate,
                authToken
            );

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.medium);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.include('application/json');

            // Assertion 4: Response Body - verify only specified fields updated
            expect(response.data.firstname).to.equal(partialUpdate.firstname);
            expect(response.data.totalprice).to.equal(partialUpdate.totalprice);
            expect(response.data).to.have.property('lastname');

            // Assertion 5: Schema Validation
            const { error } = updateBookingResponseSchema.validate(response.data);
            expect(error).to.be.undefined;
        });
    });

        it('should return 404 for non-existent booking ID', async () => {
            try {
                await bookingService.getBookingById(999999999);
                expect.fail('Should have thrown an error');
            } catch (error) {
                // Assertion 1: Status Code
                expect(error.status).to.equal(404);

                // Assertion 2: Error message exists
                expect(error.message).to.include('404');

                // Assertions 3: Proper error handling structure
                expect(error).to.have.property('status');
                expect(error.status).to.be.a('number');
            }
        });
    });

    /**
     * TEST SUITE 5: Delete Booking
     * Tests DELETE /booking/:id endpoint with authorization
     */
    describe('Delete Booking', () => {
        it('should delete booking successfully with Basic Auth', async () => {
            const response = await bookingService.deleteBooking(createdBookingId, authToken);

            // Assertion 1: Status Code
            expect(response.status).to.equal(201);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.fast);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('server');
            expect(response.headers['server']).to.exist;

            // Assertion 4: Response Body - DELETE returns 'Created' status
            expect(response.statusText).to.include('Created');

            // Assertion 5: Verify deletion by trying to get the booking
            try {
                await bookingService.getBookingById(createdBookingId);
                expect.fail('Booking should have been deleted');
            } catch (error) {
                expect(error.status).to.equal(404);
            }
        });


        it('should return 405 when deleting non-existent booking', async () => {
            try {
                await bookingService.deleteBooking(99999999, authToken);
                expect.fail('Delete should fail for non-existent booking');
            } catch (error) {

                // Assertion 1: Status Code
                // If the booking does not exist, the Restful-Booker API:
                // rejects the DELETE method for that resource with code 405
                expect(error.status).to.equal(405);

                // Assertion 2: Response Time 
                if (error.response && error.response.duration) {
                    expect(error.response.duration)
                        .to.be.below(config.expectedResponseTime.fast);
                }

                // Assertion 3: Response Headers
                if (error.response && error.response.headers) {
                    expect(error.response.headers).to.have.property('server');
                    expect(error.response.headers['server']).to.exist;
                }

                // Assertion 4: Response Body / Message
                // Restful-Booker returns plain text for DELETE errors
                expect(error.message).to.include('405');

                // Assertion 5: Error Schema / Structure
                expect(error).to.have.property('status');
                expect(error.status).to.be.a('number');

                if (error.data) {
                    expect(error.data).to.satisfy(
                        data => typeof data === 'string' || typeof data === 'object'
                    );
                }
            }
        });


    });



});
