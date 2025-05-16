import { config } from 'dotenv';
import path from 'path';
config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
}); //inject env variables

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    JWKS_URI,
    REFRESH_TOKEN_SECRET,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    JWKS_URI,
    REFRESH_TOKEN_SECRET,
};
