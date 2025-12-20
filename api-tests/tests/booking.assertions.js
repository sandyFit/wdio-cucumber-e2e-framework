const { expect } = require("chai");
const config = require("../config/config");

const assertResponse = {
    statusCode: (response, expectedStatus) => {
        expect(response.status).to.equal(expectedStatus);
    },


    responseTime: (response, threshold = 'medium') => {
        expect(response.duration).to.be.below(config.expectedResponseTime[threshold]);
    },


    jsonContentType: (response) => {
        expect(response.headers).to.have.property("content-type");
        expect(response.headers["content-type"]).to.include("application/json");
    },


    serverHeader: (response) => {
        expect(response.headers).to.have.property("server");
        expect(response.headers["server"]).to.exist;
    },


    arrayBody: (response) => {
        expect(response.data).to.be.an("array");
        expect(response.data.length).to.be.greaterThan(0);
    },


    bookingIdInBody: (response) => {
        expect(response.data).to.have.property("bookingid");
        expect(response.data.bookingid).to.be.a("number");
    },


    bookingPropertiesInBody: (responseData) => {
        expect(responseData).to.have.property("firstname");
        expect(responseData).to.have.property("lastname");
        expect(responseData).to.have.property("totalprice");
    },


    bookingDataMatches: (responseData, expectedData) => {
        if (expectedData.firstname) {
            expect(responseData.firstname).to.equal(expectedData.firstname);
        }
        if (expectedData.lastname) {
            expect(responseData.lastname).to.equal(expectedData.lastname);
        }
        if (expectedData.totalprice !== undefined) {
            expect(responseData.totalprice).to.equal(expectedData.totalprice);
        }
        if (expectedData.depositpaid !== undefined) {
            expect(responseData.depositpaid).to.equal(expectedData.depositpaid);
        }
        if (expectedData.bookingdates) {
            if (expectedData.bookingdates.checkin) {
                expect(responseData.bookingdates.checkin).to.equal(expectedData.bookingdates.checkin);
            }
            if (expectedData.bookingdates.checkout) {
                expect(responseData.bookingdates.checkout).to.equal(expectedData.bookingdates.checkout);
            }
        }
    },


    authTokenInBody: (response) => {
        expect(response.data).to.have.property("token");
        expect(response.data.token).to.be.a("string");
        expect(response.data.token.length).to.be.greaterThan(0);
    },


    schema: (response, schema) => {
        const { error } = schema.validate(response.data);
        expect(error).to.be.undefined;
    },


    errorStatusCode: (error, expectedStatus) => {
        expect(error.status).to.equal(expectedStatus);
    },


    errorMessage: (error, expectedStatus) => {
        expect(error.message).to.include(expectedStatus.toString());
    },


    errorStructure: (error) => {
        expect(error).to.have.property("status");
        expect(error.status).to.be.a("number");
    }
};

module.exports = { assertResponse };
