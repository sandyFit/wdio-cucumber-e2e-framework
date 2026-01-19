import { logger } from '../core/logger/logger';
import allure from '@wdio/allure-reporter';

/**
 * Take screenshot on failure
 */
export async function afterScenario(
    world: any,
    result: { passed: boolean; error?: Error;  duration?: number},
    context: any
): Promise<void> {
    if (!result.passed) {
        const screenshot = await browser.takeScreenshot();

        allure.addAttachment(
            'Screenshot on Failure',
            Buffer.from(screenshot, 'base64'),
            'image/png'
        );

        if (result.error) {
            logger.error('`❌ Scenario failed: ${result.error.message}`');
        }
    }
}

/**
 * Print final summary
 */
export function onComplete(
    exitCode: number,
    config: any,
    capabilities: any,
    results: { passed?: number;  failed?: number}
): void {
    const passed = results.passed || 0;
    const failed = results.failed || 0;

    logger.info('\n📊 Test Summary');
    logger.info(`✅ Passed: ${passed}`);
    logger.info(`❌ Failed: ${failed}\n`);
}

