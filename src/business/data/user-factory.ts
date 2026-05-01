export type User = {
    firstName: string;
    lastName: string;
    dob: string;
    street: string;
    postalCode: string;
    houseNumber: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
    password: string;
};

export type UserCredentials = {
    email: string;
    password: string;
};

export type InvalidUser = UserCredentials;

export type PasswordOptions = {
    length?: number;
    requireUpper?: boolean;
    requireLower?: boolean;
    requireNumber?: boolean;
    requireSymbol?: boolean;
};

export type TestCredentials = {
    getCurrentPassword: () => string;
    getNewPassword: () => string;
    updatePassword: (pwd: string) => void;
    getEmail: () => string;
};

export function createNewUser(): User {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);

    return {
        firstName: 'John',
        lastName: `Doe${random}`,
        dob: '2000-01-01',
        street: 'Siempreviva Avenue',
        houseNumber: '742',  
        postalCode: '12345',
        city: 'Springfield',
        state: 'Delaware',
        country: 'United States of America (the)',
        phone: '9123456789',
        email: `user_${timestamp}@example.com`,
        password: `PassWord$%${random}`,
    };
}

export function getExistingUser(): UserCredentials {
    return {
        email: 'customer@practicesoftwaretesting.com',
        password: 'welcome01',
    };
}

export function createInvalidUser(): InvalidUser {
    return {
        email: 'invalid-email',
        password: '123',
    };
}

export function generateRandomPassword({
    length = 12,
    requireUpper = true,
    requireLower = true,
    requireNumber = true,
    requireSymbol = true,
}: PasswordOptions = {}): string {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    // Collect required sets
    let requiredChars = '';
    const allSets: string[] = [];

    if (requireLower) {
        requiredChars += lower.charAt(Math.floor(Math.random() * lower.length));
        allSets.push(lower);
    }
    if (requireUpper) {
        requiredChars += upper.charAt(Math.floor(Math.random() * upper.length));
        allSets.push(upper);
    }
    if (requireNumber) {
        requiredChars += numbers.charAt(Math.floor(Math.random() * numbers.length));
        allSets.push(numbers);
    }
    if (requireSymbol) {
        requiredChars += symbols.charAt(Math.floor(Math.random() * symbols.length));
        allSets.push(symbols);
    }

    // Ensure minimum length
    const remainingLength = Math.max(length - requiredChars.length, 0);

    const allAllowed = allSets.join('');

    let result = requiredChars;
    for (let i = 0; i < remainingLength; i++) {
        result += allAllowed.charAt(Math.floor(Math.random() * allAllowed.length));
    }

    // Shuffle chars
    result = result
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

    return result;
}

export function createTestCredentials(user: User | UserCredentials): TestCredentials {
    let currentPassword = user.password;
    let newPassword = '';

    return {
        getCurrentPassword: () => currentPassword,
        getNewPassword: () => newPassword || currentPassword,
        updatePassword: (pwd: string) => {
            currentPassword = pwd;
            newPassword = pwd;
        },
        getEmail: () => user.email,
    };
}
