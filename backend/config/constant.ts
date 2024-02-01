const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const appConfig = {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    gmailUsername: process.env.GMAIL_USERNAME,
    gmailPassword: process.env.GMAIL_PASSWORD,
    gmailId: process.env.GMAIL_ID,
    backendUrl: process.env.BACKEND_URL,
    dirname: process.env.DIRNAME,
};

module.exports = {
    appConfig,
};
