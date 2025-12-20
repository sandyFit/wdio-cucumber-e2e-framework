import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({ colorize: true });
const baseLogger = pino({ level: 'info' }, stream);

const SENSITIVE_FIELDS = [
    'password', 'passwd', 'pwd',
    'token', 'secret', 'apikey', 'api_key',
    'authorization', 'auth'
];

/**
 * Masks sensitive data in log messages
 * @param {string} message - The log message
 * @returns {string} - Message with sensitive data masked
 */
function maskSensitiveData(message) {
    if (typeof message !== 'string') return message;

    const pattern = new RegExp(
        `(${SENSITIVE_FIELDS.join('|')})[:\\s]+([^\\s,)]+)`,
        'gi'
    );

    return message.replace(pattern, (match, field, value) => {
        const masked = '*'.repeat(8);
        return `${field}: ${masked}`;
    });
}

// automatic masking for logger methods
export const logger = {
    info: (message, ...args) => {
        baseLogger.info(maskSensitiveData(message), ...args);
    },

    debug: (message, ...args) => {
        baseLogger.debug(maskSensitiveData(message), ...args);
    },

    warn: (message, ...args) => {
        baseLogger.warn(maskSensitiveData(message), ...args);
    },

    error: (message, ...args) => {
        baseLogger.error(maskSensitiveData(message), ...args);
    },

    child: (...args) => baseLogger.child(...args),
    fatal: (message, ...args) => {
        baseLogger.fatal(maskSensitiveData(message), ...args);
    }
};
