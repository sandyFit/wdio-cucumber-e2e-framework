import pino, { Logger } from 'pino';
import pretty, { PrettyStream } from 'pino-pretty';

const stream: PrettyStream = pretty({ colorize: true });
const logger: Logger = pino({ level: 'info' }, stream);

export { logger };
