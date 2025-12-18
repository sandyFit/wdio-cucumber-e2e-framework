/**
 * Create a new unique user
 */
export function createNewUser() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);

    return {
        firstName: 'John',
        lastName: `Doe${random}`,
        dob: '2000-01-01',
        street: 'Siempreviva Avenue',
        postalCode: '666666',
        city: 'Springfield',
        state: 'Delaware',
        country: 'United States of America (the)',
        phone: '9123456789',
        email: `user_${timestamp}@example.com`,
        password: `PassWord$%${random}`
    };
}

/**
 * Get existing registered user (credentials from the demo testing API website)
 */
export function getExistingUser() {
    return {
        email: 'customer@practicesoftwaretesting.com',
        password: 'welcome01'
    };
}

/**
 * Create invalid user data
 */
export function createInvalidUser() {
    return {
        email: 'invalid-email',
        password: '123'
    };
}

/**
 * Generate random password
 */
export function generateRandomPassword({
    length = 12,
    requireUpper = true,
    requireLower = true,
    requireNumber = true,
    requireSymbol = true
} = {}) {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    // Collect required sets
    let requiredChars = '';
    const allSets = [];

    if (requireLower) { requiredChars += lower.charAt(Math.floor(Math.random() * lower.length)); allSets.push(lower); }
    if (requireUpper) { requiredChars += upper.charAt(Math.floor(Math.random() * upper.length)); allSets.push(upper); }
    if (requireNumber) { requiredChars += numbers.charAt(Math.floor(Math.random() * numbers.length)); allSets.push(numbers); }
    if (requireSymbol) { requiredChars += symbols.charAt(Math.floor(Math.random() * symbols.length)); allSets.push(symbols); }

    // Ensure minimum length
    const remainingLength = Math.max(length - requiredChars.length, 0);

    const allAllowed = allSets.join('');

    let result = requiredChars;
    for (let i = 0; i < remainingLength; i++) {
        result += allAllowed.charAt(Math.floor(Math.random() * allAllowed.length));
    }

    // Shuffle result so required chars aren't all at the start
    result = result.split('').sort(() => Math.random() - 0.5).join('');

    return result;
}


/**
 * Factory to create a test credentials object
 */
export function createTestCredentials(user) {
    let currentPassword = user.password;
    let newPassword = '';

    return {
        getCurrentPassword: () => currentPassword,
        getNewPassword: () => newPassword || currentPassword,
        updatePassword: (pwd) => {
            currentPassword = pwd;
            newPassword = pwd;
        },
        getEmail: () => user.email,
        logCredentials: () => {
            console.log(`Email: ${user.email}`);
            console.log(`Password: ${currentPassword}`);
        }
    };
}







