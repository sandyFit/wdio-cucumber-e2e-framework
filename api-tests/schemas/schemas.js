const Joi = require('joi');

/**
 * Schema for booking dates object
 */
const bookingDatesSchema = Joi.object({
    checkin: Joi.string().required(),
    checkout: Joi.string().required()
});

/**
 * Schema for a single booking object
 */
const bookingSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    totalprice: Joi.number().integer().positive().required(),
    depositpaid: Joi.boolean().required(),
    bookingdates: bookingDatesSchema.required(),
    additionalneeds: Joi.string().allow('', null).optional()
});

/**
 * Schema for booking creation response
 */
const createBookingResponseSchema = Joi.object({
    bookingid: Joi.number().integer().positive().required(),
    booking: bookingSchema.required()
});

/**
 * Schema for single booking ID object
 */
const bookingIdSchema = Joi.object({
    bookingid: Joi.number().integer().positive().required()
});

/**
 * Schema for array of booking IDs
 */
const bookingIdsArraySchema = Joi.array().items(bookingIdSchema).min(0);

/**
 * Schema for authentication token response
 */
const authTokenSchema = Joi.object({
    token: Joi.string().required()
});

/**
 * Schema for update/patch response (returns the booking object directly)
 */
const updateBookingResponseSchema = bookingSchema;

module.exports = {
    bookingSchema,
    bookingDatesSchema,
    createBookingResponseSchema,
    bookingIdSchema,
    bookingIdsArraySchema,
    authTokenSchema,
    updateBookingResponseSchema
}
