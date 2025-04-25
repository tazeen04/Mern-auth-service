import { config } from 'dotenv';
config(); //inject env variables

const { PORT, NODE_ENV } = process.env;

export const Config = {
    PORT,
    NODE_ENV,
};
