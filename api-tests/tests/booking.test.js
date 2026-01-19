const { expect } = require("chai");
const BookingService = require("../services/BookingService");
const { assertResponse } = require("./booking.assertions");
const config = require("../config/config");
const {
    bookingIdsArraySchema,
    createBookingResponseSchema,
    bookingSchema,
    updateBookingResponseSchema,
    authTokenSchema,
} = require("../schemas/schemas");


describe("Restful-Booker API Tests", () => {
    let bookingService;
    let authToken;
    let createdBookingId;

    // Test data
    const testBookingData = {
        firstname: "John",
        lastname: "Doe",
        totalprice: 250,
        depositpaid: true,
        bookingdates: {
            checkin: "2024-01-01",
            checkout: "2024-01-05",
        },
        additionalneeds: "Breakfast",
    };

    const minimalBookingData = {
        firstname: "Jane",
        lastname: "Doe",
        totalprice: 200,
        depositpaid: false,
        bookingdates: {
            checkin: "2024-02-01",
            checkout: "2024-02-03",
        },
    };

    before(async () => {
        bookingService = new BookingService();
        const tokenResponse = await bookingService.createAuthToken();
        authToken = tokenResponse.data.token;
    });

    /**
     * TEST SUITE 1: Get Booking IDs
     * Tests GET /booking endpoint with and without filters
     */
    describe("Get Booking IDs", () => {
        it("should get all booking IDs without filters", async () => {
            const response = await bookingService.getAllBookingIds();

            assertResponse.statusCode(response, 200);

            assertResponse.responseTime(response, 'medium');

            assertResponse.jsonContentType(response);


            assertResponse.arrayBody(response);

            assertResponse.schema(response, bookingIdsArraySchema);
        });

        it("should filter booking IDs by firstname and lastname", async () => {
            const filters = {
                firstname: "John",
                lastname: "Smith",
            };

            const response = await bookingService.getAllBookingIds(filters);

            assertResponse.statusCode(response, 300);

            assertResponse.responseTime(response, 'medium');

            assertResponse.jsonContentType(response);


            expect(response.data).to.be.an("array");

            assertResponse.schema(response, bookingIdsArraySchema);
        });
    });

    /**
     * TEST SUITE 2: Create Booking
     * Tests POST /booking endpoint
     */
    describe("Create Booking", () => {
        it("should create booking with complete data", async () => {
            const response = await bookingService.createBooking(testBookingData);
            createdBookingId = response.data.bookingid;

            assertResponse.statusCode(response, 200);

            assertResponse.responseTime(response, 'medium');

            assertResponse.jsonContentType(response);


            assertResponse.bookingIdInBody(response);
            assertResponse.bookingDataMatches(response.data.booking, testBookingData);

            assertResponse.schema(response, createBookingResponseSchema);
        });

        it("should create booking with minimal required data", async () => {
            const response = await bookingService.createBooking(minimalBookingData);

            assertResponse.statusCode(response, 200);

            assertResponse.responseTime(response, 'medium');

            assertResponse.jsonContentType(response);
            assertResponse.serverHeader(response);

            assertResponse.bookingIdInBody(response);
            assertResponse.bookingDataMatches(response.data.booking, minimalBookingData);

            assertResponse.schema(response, createBookingResponseSchema);
        });
    });

    describe("Get Booking Details", () => {
        it("should get booking by valid ID", async () => {
            const response = await bookingService.getBookingById(createdBookingId);

            assertResponse.statusCode(response, 200);

            assertResponse.responseTime(response, 'fast');

            assertResponse.jsonContentType(response);

            assertResponse.bookingPropertiesInBody(response.data);
            assertResponse.bookingDataMatches(response.data, testBookingData);

            assertResponse.schema(response, bookingSchema);
        });

        it("should return 404 for non-existent booking ID", async () => {
            try {
                await bookingService.getBookingById(999999999);
                expect.fail("Should have thrown an error");
            } catch (error) {

                assertResponse.errorStatusCode(error, 404);

                // Assertion 2: Error message exists
                assertResponse.errorMessage(error, 404);

                // Assertion 3: Proper error handling structure
                assertResponse.errorStructure(error);
            }
        });
    });

    /**
     * TEST SUITE 4: Update Booking
     * Tests PUT and PATCH /booking/:id endpoints with authorization
     */
    describe("Update Booking", () => {
        it("should fully update booking with PUT using Basic Auth", async () => {
            const updatedData = {
                firstname: "UpdatedJohn",
                lastname: "UpdatedDoe",
                totalprice: 250,
                depositpaid: false,
                bookingdates: {
                    checkin: "2024-03-01",
                    checkout: "2024-03-10",
                },
                additionalneeds: "Lunch",
            };

            const response = await bookingService.updateBooking(
                createdBookingId,
                updatedData,
                authToken,
            );

            assertResponse.statusCode(response, 200);

            assertResponse.responseTime(response, 'medium');

            assertResponse.jsonContentType(response);

            assertResponse.bookingDataMatches(response.data, updatedData);

            assertResponse.schema(response, updateBookingResponseSchema);
        });

        it("should partially update booking with PATCH using Basic Auth", async () => {
            const partialUpdate = {
                firstname: "PartiallyUpdated",
                totalprice: 175,
            };

            const response = await bookingService.partialUpdateBooking(
                createdBookingId,
                partialUpdate,
                authToken,
            );

            assertResponse.statusCode(response, 200);

            assertResponse.responseTime(response, 'medium');

            assertResponse.jsonContentType(response);

            // Verify only specified fields updated
            assertResponse.bookingDataMatches(response.data, partialUpdate);
            expect(response.data).to.have.property("lastname");

            assertResponse.schema(response, updateBookingResponseSchema);
        });
    });

    /**
     * TEST SUITE 5: Delete Booking
     * Tests DELETE /booking/:id endpoint with authorization
     */
    describe("Delete Booking", () => {
        it("should delete booking successfully with Basic Auth", async () => {
            const response = await bookingService.deleteBooking(
                createdBookingId,
                authToken,
            );

            assertResponse.statusCode(response, 201);

            assertResponse.responseTime(response, 'fast');

            assertResponse.serverHeader(response);

            // Response Body - DELETE returns 'Created' status
            expect(response.statusText).to.include("Created");

            // Verify deletion by trying to get the booking
            try {
                await bookingService.getBookingById(createdBookingId);
                expect.fail("Booking should have been deleted");
            } catch (error) {
                assertResponse.errorStatusCode(error, 404);
            }
        });

        it("should return 405 when deleting non-existent booking", async () => {
            try {
                await bookingService.deleteBooking(99999999, authToken);
                expect.fail("Delete should fail for non-existent booking");
            } catch (error) {

                assertResponse.errorStatusCode(error, 405);

                if (error.response && error.response.duration) {
                    assertResponse.responseTime(error.response, 'fast');
                }

                if (error.response && error.response.headers) {
                    assertResponse.serverHeader(error.response);
                }

                assertResponse.errorMessage(error, 405);

                // Error Schema / Structure
                assertResponse.errorStructure(error);
                if (error.data) {
                    expect(error.data).to.satisfy(
                        (data) => typeof data === "string" || typeof data === "object",
                    );
                }
            }
        });
    });

    /**
     * TEST SUITE 6: Complete CRUD Flow
     * Tests full Create -> Read -> Update -> Delete lifecycle
     */
    describe("Complete CRUD Flow", () => {
        it("should perform Create -> Read -> Update -> Delete flow", async () => {
            const createResponse = await bookingService.createBooking({
                firstname: "CRUD",
                lastname: "Test",
                totalprice: 100,
                depositpaid: true,
                bookingdates: {
                    checkin: "2024-04-01",
                    checkout: "2024-04-05",
                },
            });

            assertResponse.statusCode(createResponse, 200);
            const bookingId = createResponse.data.bookingid;
            expect(bookingId).to.be.a("number");

            const readResponse = await bookingService.getBookingById(bookingId);
            assertResponse.statusCode(readResponse, 200);
            expect(readResponse.data.firstname).to.equal("CRUD");

            const updateResponse = await bookingService.updateBooking(
                bookingId,
                {
                    firstname: "UpdatedCRUD",
                    lastname: "UpdatedTest",
                    totalprice: 150,
                    depositpaid: false,
                    bookingdates: {
                        checkin: "2024-05-01",
                        checkout: "2024-05-05",
                    },
                },
                authToken,
            );
            assertResponse.statusCode(updateResponse, 200);
            expect(updateResponse.data.firstname).to.equal("UpdatedCRUD");

            // READ again to verify update
            const readAfterUpdate = await bookingService.getBookingById(bookingId);
            assertResponse.statusCode(readAfterUpdate, 200);
            expect(readAfterUpdate.data.firstname).to.equal("UpdatedCRUD");
            expect(readAfterUpdate.data.totalprice).to.equal(150);

            const deleteResponse = await bookingService.deleteBooking(
                bookingId,
                authToken,
            );
            assertResponse.statusCode(deleteResponse, 201);

            // Step 6: Verify deletion
            try {
                await bookingService.getBookingById(bookingId);
                expect.fail("Booking should be deleted");
            } catch (error) {
                assertResponse.errorStatusCode(error, 404);
            }
        });

        it("should perform CRUD flow with partial update booking", async () => {
            const createResponse = await bookingService.createBooking({
                firstname: "Patch",
                lastname: "Flow",
                totalprice: 90,
                depositpaid: true,
                bookingdates: {
                    checkin: "2024-08-01",
                    checkout: "2024-08-03",
                },
            });

            const bookingId = createResponse.data.bookingid;

            const patchResponse = await bookingService.partialUpdateBooking(
                bookingId,
                { totalprice: 200 },
                authToken,
            );
            assertResponse.statusCode(patchResponse, 200);

            const readResponse = await bookingService.getBookingById(bookingId);
            expect(readResponse.data.totalprice).to.equal(200);

            await bookingService.deleteBooking(bookingId, authToken);
        });
    });

    /**
     * TEST SUITE 7: Authentication
     * Tests POST /auth endpoint
     */
    describe("Authentication", () => {
        it("should create authentication token", async () => {
            const response = await bookingService.createAuthToken();

            assertResponse.statusCode(response, 200);

            assertResponse.responseTime(response, 'fast');

            assertResponse.jsonContentType(response);

            assertResponse.authTokenInBody(response);

            assertResponse.schema(response, authTokenSchema);
        });

        it("should return reason when authentication credentials are invalid", async () => {
            const response = await bookingService.client.post(config.endpoints.auth, {
                username: "invalidUser",
                password: "invalidPass",
            });

            // status code 200 is the Rest Booking behavior for bad credentials
            assertResponse.statusCode(response, 200);

            assertResponse.responseTime(response, 'fast');

            assertResponse.jsonContentType(response);

            expect(response.data).to.have.property("reason");
            expect(response.data.reason).to.equal("Bad credentials");

            // Ensure token is NOT returned
            expect(response.data).to.not.have.property("token");
        });
    });
});
