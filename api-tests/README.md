# API Testing Framework - Restful-Booker

Comprehensive API testing framework for the Restful-booker API using Axios, Mocha, Chai, and Joi.

## Features

- **Layered Architecture**: Clean separation of concerns (Config, Services, Schemas, Tests)
- **Service Layer Pattern**: Reusable API methods with error handling
- **Comprehensive Assertions**: All tests include status code, response time, headers, body, and schema validation
- **Authentication Support**: Basic Auth implementation for protected endpoints
- **Schema Validation**: Joi-based response validation
- **Response Time Tracking**: Built-in request/response timing

## Project Structure

```
api-tests/
├── config/          # Configuration management
├── services/        # API service layer
├── schemas/         # Joi validation schemas
├── tests/           # Test suites
└── package.json     # Dependencies and scripts
```

## Setup Instructions

### 1. Navigate to api-tests directory
```bash
cd api-tests
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment is already configured
The `.env` file contains default values that work out of the box.

## Running Tests

### Run all tests
```bash
npm run test:api
```

## Test Coverage

### 7 Test Suites, 14 Tests Total

1. **Get Booking IDs** (2 tests)
   - Get all booking IDs
   - Filter by firstname and lastname

2. **Create Booking** (2 tests)
   - Create with complete data
   - Create with minimal data

3. **Get Booking Details** (2 tests)
   - Get valid booking
   - Handle 404 error

4. **Update Booking** (2 tests)
   - Full update (PUT) with Basic Auth
   - Partial update (PATCH) with Basic Auth

5. **Delete Booking** (2 test)
   - Delete with Basic Auth
   - Delete non-existent booking

6. **Complete CRUD Flow** (2 test)
   - Full lifecycle test with full update
   - Full lifecycle test with partial update

6. **Authentication** (2 tests)
    - Create authentication token with valid credentials
    - Fail to authenticate with invalid credentials


### All 5 Assertion Types in Every Test

1. ✅ Status Code
2. ✅ Response Time
3. ✅ Response Headers
4. ✅ Response Body
5. ✅ Schema Validation

## Design Principles

### DRY (Don't Repeat Yourself)
- Reusable service methods
- Shared test data
- Centralized configuration

### KISS (Keep It Simple)
- Straightforward service class
- Clear test structure
- Simple error handling

### YAGNI (You Aren't Gonna Need It)
- No unnecessary abstractions
- Only required features
- Focused implementation

## Expected Output

```
  Restful-Booker API Tests

    Get Booking IDs
      ✓ should get all booking IDs without filters
      ✓ should filter booking IDs by firstname and lastname

    Create Booking
      ✓ should create booking with complete data
      ✓ should create booking with minimal required data

    Get Booking Details
      ✓ should get booking by valid ID
      ✓ should return 404 for non-existent booking ID

    Update Booking
      ✓ should fully update booking with PUT using Basic Auth
      ✓ should partially update booking with PATCH using Basic Auth

    Delete Booking
      ✓ should delete booking successfully with Basic Auth

    Complete CRUD Flow
      ✓ should perform Create -> Read -> Update -> Delete flow
      ✓ should perform CRUD flow with partial update booking

    Authentication
      ✓ should create authentication token
      ✓ should return reason when authentication credentials are invalid

  11 passing (4.5s)
```

## API Documentation

[Restful-booker API Docs](https://restful-booker.herokuapp.com/apidoc/index.html)
