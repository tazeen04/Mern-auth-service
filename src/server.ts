import { Config } from './config';
import app from './app';

const startServer = () => {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () => console.log(`Listening on pory ${PORT}`));
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();
