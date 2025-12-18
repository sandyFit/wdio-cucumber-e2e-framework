import { Before, After, BeforeAll, AfterAll } from '@wdio/cucumber-framework';
import { logger } from '../../core/logger/logger.js';
import { getExistingUser, createNewUser } from '../../business/data/user-factory.js';
import { LoginPage } from '../../business/pages/auth/login.page.js';
import { SignupPage } from '../../business/pages/auth/signup.page.js';

const loginPage = new LoginPage();
const signupPage = new SignupPage();

logger.info('🔧 HOOKS: hooks.js loaded');

BeforeAll(async function () {
    logger.info('==============================================');
    logger.info('SETTING UP TEST SUITE');
    logger.info('==============================================');
});

Before(async function ({ pickle }) {
    logger.info(`🎬 Starting scenario: "${pickle.name}"`);

    await browser.setWindowSize(1920, 1080);

    const name = pickle.name.toLowerCase();

    const requiresLogin =
        !name.includes('sign up') &&
        !name.includes('signup') &&
        (
            name.includes('profile') ||
            name.includes('password') ||
            name.includes('favorite') ||
            name.includes('favourite') ||
            name.includes('account')
        );

    if (requiresLogin) {
        logger.info('🔐 Scenario requires authenticated user');

        // Profile/password scenarios already used a new account — keep same logic
        const isProfileTest = name.includes('profile') || name.includes('password');

        if (isProfileTest) {
            logger.info('🆕 Creating new user for profile test');

            const newUser = createNewUser();

            await signupPage.open();
            await signupPage.registerUser(newUser);

            await browser.waitUntil(
                async () => (await browser.getUrl()).includes('/auth/login'),
                {
                    timeout: 10000,
                    timeoutMsg: 'Expected redirect to login page after registration'
                }
            );

            logger.info('✔ User registered, now logging in');

            await loginPage.open();
            await loginPage.login(newUser.email, newUser.password);

            logger.info('✔ New user registered and logged in');
            this.currentUser = newUser;

        } else {
            // ⭐ CHANGE HERE:
            // For ALL other scenarios → also create a NEW user, so favorites is always empty.
            logger.info('🆕 Creating new user for scenario (clean account state)');

            const newUser = createNewUser();

            await signupPage.open();
            await signupPage.registerUser(newUser);

            await browser.waitUntil(
                async () => (await browser.getUrl()).includes('/auth/login'),
                {
                    timeout: 10000,
                    timeoutMsg: 'Expected redirect to login page after registration'
                }
            );

            logger.info('✔ User registered, now logging in');

            await loginPage.open();
            await loginPage.login(newUser.email, newUser.password);

            logger.info('✔ New user registered and logged in');
            this.currentUser = newUser;
        }
    } else {
        logger.info('No login required for this scenario');
    }
});

After(function ({ pickle, result }) {
    const status = result?.status || 'UNKNOWN';
    const emoji = status === 'PASSED' ? '✅' : '❌';
    logger.info(`${emoji} Completed: "${pickle.name}" - ${status}`);
});

AfterAll(function () {
    logger.info('==============================================');
    logger.info('TEST SUITE COMPLETED');
    logger.info('==============================================');
});
