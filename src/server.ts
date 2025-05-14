import { Config } from './config';
import app from './app';
import logger from './config/logger';
import { AppDataSource } from './config/data-source';

const startServer = async () => {
    const PORT = Config.PORT;
    try {
        // run server
        await AppDataSource.initialize();
        logger.info('Database connected successfully.');
        app.listen(PORT, () => {
            logger.info('Listening on port', { port: PORT });
        });
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

void startServer();
