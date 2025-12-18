import { expect, assert } from 'chai';

/**
 * Assert that specified fields in an object exist and are not empty
 * @param {Object} object - Object to validate
 * @param {Array<string>} fields - Field names to check
 */
export function assertNotEmptyFields(object, fields) {
    fields.forEach(field => {
        assert.exists(object[field], `Field "${field}" should exist`);
        assert.isNotEmpty(object[field], `Field "${field}" should not be empty`);
    });
}

/**
 * Assert element count matches expected
 * @param {Array} elements - Array of elements
 * @param {number} expectedCount - Expected count
 * @param {string} elementName - Name for error message
 */
export function assertElementCount(elements, expectedCount, elementName = 'elements') {
    expect(elements.length).to.equal(
        expectedCount,
        `Expected ${expectedCount} ${elementName}, but found ${elements.length}`
    );
}

/**
 * Assert element count is at least minimum
 * @param {Array} elements - Array of elements
 * @param {number} minCount - Minimum expected count
 * @param {string} elementName - Name for error message
 */
export function assertMinimumElements(elements, minCount, elementName = 'elements') {
    assert.isAtLeast(
        elements.length,
        minCount,
        `Expected at least ${minCount} ${elementName}, but found ${elements.length}`
    );
}
