import { expect, assert } from 'chai';

export function assertNotEmptyFields(
    object: Record<string, any>,
    fields: string[]
): void {
    fields.forEach((field) => {
        assert.exists(object[field], `Field "${field}" should exist`);
        assert.isNotEmpty(object[field], `Field "${field}" should not be empty`);
    });
}

export function assertElementCount(
    elements: any[],
    expectedCount: number,
    elementName: string = 'elements'
): void {
    expect(elements.length).to.equal(
        expectedCount,
        `Expected ${expectedCount} ${elementName}, but found ${elements.length}`
    );
}

export function assertMinimumElements(
    elements: any[],
    minCount: number,
    elementName: string = 'elements'
): void {
    assert.isAtLeast(
        elements.length,
        minCount,
        `Expected at least ${minCount} ${elementName}, but found ${elements.length}`
    );
}


