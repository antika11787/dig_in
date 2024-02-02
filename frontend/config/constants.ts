const dotenv = require("dotenv");
dotenv.config();

const appConfig = {
  nextPublicApiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export default appConfig;
