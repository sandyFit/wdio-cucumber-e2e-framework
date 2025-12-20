import { logger } from '../core/logger/logger.js';

/**
 * Take screenshot on failure
 */
export async function afterScenario(_world, result) {
    if (!result.passed) {
        await browser.takeScreenshot();
    }
}

/**
 * Print final summary
 */
export function onComplete(_exitCode, _config, _capabilities, results) {
    const passed = results.passed || 0;
    const failed = results.failed || 0;

    logger.info('\n📊 Test Summary');
    logger.info(`✅ Passed: ${passed}`);
    logger.info(`❌ Failed: ${failed}\n`);
}

