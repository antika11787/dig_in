const dotenv = require("dotenv");
dotenv.config();

const appConfig = {
  nextPublicApiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  nextPublicStripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
};

export default appConfig;
