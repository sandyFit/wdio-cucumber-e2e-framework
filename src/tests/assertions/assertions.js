import { expect, assert } from "chai";

export function assertNotEmptyFields(object, fields) {
  fields.forEach((field) => {
    assert.exists(object[field], `Field "${field}" should exist`);
    assert.isNotEmpty(object[field], `Field "${field}" should not be empty`);
  });
}

export function assertElementCount(
  elements,
  expectedCount,
  elementName = "elements",
) {
  expect(elements.length).to.equal(
    expectedCount,
    `Expected ${expectedCount} ${elementName}, but found ${elements.length}`,
  );
}

export function assertMinimumElements(
  elements,
  minCount,
  elementName = "elements",
) {
  assert.isAtLeast(
    elements.length,
    minCount,
    `Expected at least ${minCount} ${elementName}, but found ${elements.length}`,
  );
}
